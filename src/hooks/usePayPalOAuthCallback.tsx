import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const STORAGE_KEY = "paypal_oauth_redirect_uri";

export function savePayPalRedirectUri(uri: string) {
  try {
    sessionStorage.setItem(STORAGE_KEY, uri);
  } catch {}
}

interface Options {
  enabled?: boolean;
  onSuccess?: () => void;
}

export function usePayPalOAuthCallback({ enabled = true, onSuccess }: Options = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const ranRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const code = searchParams.get("code");
    const errParam = searchParams.get("error");
    if (!code && !errParam) return;
    if (ranRef.current) return;
    ranRef.current = true;

    if (errParam) {
      toast.error(`PayPal error: ${errParam}`);
      setSearchParams({}, { replace: true });
      return;
    }

    // Use the redirect_uri that was used to start auth, falling back to current pathname.
    let redirectUri: string | null = null;
    try {
      redirectUri = sessionStorage.getItem(STORAGE_KEY);
    } catch {}
    if (!redirectUri) {
      redirectUri = `${window.location.origin}${window.location.pathname}`;
    }

    const t = toast.loading("Connecting PayPal...");
    supabase.functions
      .invoke("paypal-oauth", {
        body: { action: "exchange_code", code, redirect_uri: redirectUri },
      })
      .then(({ data, error }) => {
        toast.dismiss(t);
        if (error || data?.error) {
          toast.error(data?.error || error?.message || "PayPal connection failed");
        } else {
          toast.success("PayPal connected!");
          try {
            sessionStorage.removeItem(STORAGE_KEY);
          } catch {}
          onSuccess?.();
        }
        setSearchParams({}, { replace: true });
      });
  }, [enabled, searchParams, setSearchParams, onSuccess]);
}
