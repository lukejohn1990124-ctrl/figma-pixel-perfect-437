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

const CLIENT_ID = Deno.env.get("PAYPAL_CLIENT_ID")!;
const CLIENT_SECRET = Deno.env.get("PAYPAL_CLIENT_SECRET")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Missing authorization" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: integ } = await admin
      .from("integrations")
      .select("*")
      .eq("user_id", user.id)
      .eq("provider", "paypal")
      .maybeSingle();

    if (!integ || !integ.is_connected)
      return json({ error: "PayPal not connected" }, 400);

    let accessToken = integ.access_token as string;

    // Try refresh first if we have refresh_token (tokens last ~9h, so be safe)
    if (integ.refresh_token) {
      const refreshRes = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: integ.refresh_token,
        }),
      });
      if (refreshRes.ok) {
        const rd = await refreshRes.json();
        accessToken = rd.access_token;
        await admin
          .from("integrations")
          .update({ access_token: accessToken })
          .eq("id", integ.id);
      }
    }

    // Fetch invoices (paginated, simple — first 100)
    const invRes = await fetch(
      `${PAYPAL_BASE}/v2/invoicing/invoices?page=1&page_size=100&total_required=true`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const invData = await invRes.json();
    if (!invRes.ok) {
      console.error("PayPal invoices fetch failed", invData);
      return json(
        { error: "Failed to fetch invoices", details: invData },
        invRes.status
      );
    }

    const items = (invData.items ?? []) as any[];
    let synced = 0;

    for (const inv of items) {
      const recipient = inv.primary_recipients?.[0]?.billing_info ?? {};
      const clientName =
        [recipient.name?.given_name, recipient.name?.surname]
          .filter(Boolean)
          .join(" ") || recipient.business_name || "Unknown";
      const amount = parseFloat(inv.amount?.value ?? "0");
      const status = mapStatus(inv.status);

      await admin.from("invoices").upsert(
        {
          user_id: user.id,
          external_id: inv.id,
          invoice_number: inv.detail?.invoice_number ?? inv.id,
          client_name: clientName,
          client_email: recipient.email_address ?? null,
          amount,
          status,
          due_date: inv.detail?.payment_term?.due_date ?? null,
          payment_date:
            inv.payments?.transactions?.[0]?.payment_date ?? null,
        },
        { onConflict: "user_id,external_id" }
      );
      synced++;
    }

    await admin
      .from("integrations")
      .update({ last_synced_at: new Date().toISOString() })
      .eq("id", integ.id);

    return json({ success: true, synced, total: invData.total_items ?? items.length });
  } catch (e) {
    console.error("paypal-sync-invoices error", e);
    return json({ error: String(e) }, 500);
  }
});

function mapStatus(s: string): string {
  switch (s) {
    case "PAID":
    case "MARKED_AS_PAID":
      return "paid";
    case "SENT":
    case "UNPAID":
    case "PARTIALLY_PAID":
      return "pending";
    case "CANCELLED":
    case "REFUNDED":
      return "cancelled";
    case "DRAFT":
      return "draft";
    default:
      return s.toLowerCase();
  }
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
