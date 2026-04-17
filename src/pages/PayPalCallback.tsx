import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function PayPalCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Connecting your PayPal account...");
  const ranRef = useRef(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    if (ranRef.current) return;
    ranRef.current = true;

    const code = params.get("code");
    const error = params.get("error");

    if (error) {
      setStatus("error");
      setMessage(`PayPal returned an error: ${error}`);
      return;
    }
    if (!code) {
      setStatus("error");
      setMessage("Missing authorization code from PayPal.");
      return;
    }

    const redirectUri = `${window.location.origin}/connections/paypal/callback`;

    supabase.functions
      .invoke("paypal-oauth", {
        body: { action: "exchange_code", code, redirect_uri: redirectUri },
      })
      .then(({ data, error }) => {
        if (error || data?.error) {
          console.error("Exchange failed", error, data);
          setStatus("error");
          setMessage(data?.error || error?.message || "Connection failed.");
          return;
        }
        setStatus("success");
        setMessage("PayPal connected successfully!");
        toast.success("PayPal connected");
        setTimeout(() => navigate("/paypal"), 1200);
      });
  }, [params, user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 max-w-md w-full text-center">
        {status === "loading" && (
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        )}
        {status === "success" && (
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
        )}
        {status === "error" && (
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        )}
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          {status === "success" ? "All set!" : status === "error" ? "Connection failed" : "Just a moment"}
        </h1>
        <p className="text-gray-600 mb-6">{message}</p>
        {status === "error" && (
          <button
            onClick={() => navigate("/connections")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
          >
            Back to Connections
          </button>
        )}
      </div>
    </div>
  );
}
