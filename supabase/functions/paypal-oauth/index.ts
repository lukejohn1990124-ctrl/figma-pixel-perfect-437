import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const PAYPAL_ENV = (Deno.env.get("PAYPAL_ENVIRONMENT") ?? "sandbox").toLowerCase();
const PAYPAL_BASE =
  PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
const PAYPAL_WEB =
  PAYPAL_ENV === "live"
    ? "https://www.paypal.com"
    : "https://www.sandbox.paypal.com";

const CLIENT_ID = Deno.env.get("PAYPAL_CLIENT_ID")!;
const CLIENT_SECRET = Deno.env.get("PAYPAL_CLIENT_SECRET")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Missing authorization" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) return json({ error: "Unauthorized" }, 401);

    const body = await req.json().catch(() => ({}));
    const action = body.action as "get_auth_url" | "exchange_code";

    if (action === "get_auth_url") {
      const redirectUri = body.redirect_uri as string;
      if (!redirectUri) return json({ error: "redirect_uri required" }, 400);

      const url = new URL(`${PAYPAL_WEB}/connect`);
      url.searchParams.set("flowEntry", "static");
      url.searchParams.set("client_id", CLIENT_ID);
      url.searchParams.set("response_type", "code");
      url.searchParams.set(
        "scope",
        "openid profile email https://uri.paypal.com/services/invoicing"
      );
      url.searchParams.set("redirect_uri", redirectUri);
      url.searchParams.set("state", user.id);

      return json({ auth_url: url.toString() });
    }

    if (action === "exchange_code") {
      const code = body.code as string;
      const redirectUri = body.redirect_uri as string;
      if (!code || !redirectUri)
        return json({ error: "code and redirect_uri required" }, 400);

      const tokenRes = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
        method: "POST",
        headers: {
          Authorization:
            "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) {
        console.error("Token exchange failed", tokenData);
        return json(
          { error: "Token exchange failed", details: tokenData },
          400
        );
      }

      // Optional: fetch userinfo for identifier
      let identifier: string | null = null;
      try {
        const uiRes = await fetch(
          `${PAYPAL_BASE}/v1/identity/openidconnect/userinfo?schema=openid`,
          { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
        );
        if (uiRes.ok) {
          const ui = await uiRes.json();
          identifier = ui.email ?? ui.user_id ?? null;
        }
      } catch (_) {}

      // Use service role to upsert (bypasses RLS but we control user_id)
      const adminClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      // Upsert: delete existing then insert
      await adminClient
        .from("integrations")
        .delete()
        .eq("user_id", user.id)
        .eq("provider", "paypal");

      const { error: insErr } = await adminClient.from("integrations").insert({
        user_id: user.id,
        provider: "paypal",
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token ?? null,
        user_identifier: identifier,
        is_connected: true,
      });

      if (insErr) {
        console.error("DB insert failed", insErr);
        return json({ error: "Failed to save integration" }, 500);
      }

      return json({ success: true, identifier });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    console.error("paypal-oauth error", e);
    return json({ error: String(e) }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
