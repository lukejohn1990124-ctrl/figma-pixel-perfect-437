import { useEffect, useState } from "react";
import { CheckCircle2, Link2, Loader2, RefreshCw } from "lucide-react";
import DashboardNav from "@/components/DashboardNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { usePayPalOAuthCallback, savePayPalRedirectUri } from "@/hooks/usePayPalOAuthCallback";

interface Integration {
  id: string;
  name: string;
  description: string;
  logo: string;
  color: string;
  available: boolean;
}

const integrationConfigs: Integration[] = [
  {
    id: "paypal",
    name: "PayPal",
    description: "Sync PayPal invoices and track payments automatically",
    logo: "P",
    color: "bg-[#0070ba]",
    available: true,
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Connect your Stripe account to automatically sync invoices and payment data",
    logo: "S",
    color: "bg-[#635bff]",
    available: false,
  },
  {
    id: "wave",
    name: "Wave",
    description: "Import Wave accounting invoices and client data",
    logo: "W",
    color: "bg-gray-700",
    available: false,
  },
  {
    id: "gumroad",
    name: "Gumroad",
    description: "Track digital product sales and send payment reminders",
    logo: "G",
    color: "bg-pink-500",
    available: false,
  },
];

export default function ConnectionsPage() {
  const { user } = useAuth();
  const [connectedProviders, setConnectedProviders] = useState<Record<string, { identifier: string | null; lastSynced: string | null }>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const loadIntegrations = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("integrations")
      .select("provider, user_identifier, last_synced_at, is_connected")
      .eq("user_id", user.id);
    const map: typeof connectedProviders = {};
    (data ?? []).forEach((row) => {
      if (row.is_connected) {
        map[row.provider] = {
          identifier: row.user_identifier,
          lastSynced: row.last_synced_at,
        };
      }
    });
    setConnectedProviders(map);
  };

  useEffect(() => {
    loadIntegrations();
  }, [user]);

  usePayPalOAuthCallback({ enabled: !!user, onSuccess: loadIntegrations });

  const getPayPalRedirectUri = () => {
    const host = window.location.hostname;
    // Use the canonical published domain when on a Lovable preview subdomain,
    // since PayPal only accepts the exact registered Return URL.
    const isPreview = host.endsWith(".lovable.app") && host !== "figma-pixel-perfect-437.lovable.app";
    const origin = isPreview
      ? "https://figma-pixel-perfect-437.lovable.app"
      : window.location.origin;
    return `${origin}/connections`;
  };

  const handleConnectPayPal = async () => {
    if (!user) {
      toast.error("Please sign in first");
      return;
    }
    setBusy("paypal");
    try {
      const redirectUri = getPayPalRedirectUri();
      savePayPalRedirectUri(redirectUri);
      const { data, error } = await supabase.functions.invoke("paypal-oauth", {
        body: { action: "get_auth_url", redirect_uri: redirectUri },
      });
      if (error || data?.error) {
        throw new Error(data?.error || error?.message || "Failed to start PayPal connection");
      }
      window.location.href = data.auth_url;
    } catch (e: any) {
      toast.error(e.message);
      setBusy(null);
    }
  };

  const handleDisconnect = async (provider: string) => {
    if (!user) return;
    setBusy(provider);
    const { error } = await supabase
      .from("integrations")
      .delete()
      .eq("user_id", user.id)
      .eq("provider", provider);
    setBusy(null);
    if (error) {
      toast.error("Failed to disconnect");
      return;
    }
    toast.success(`${provider} disconnected`);
    loadIntegrations();
  };

  const handleSync = async (provider: string) => {
    setBusy(provider);
    try {
      const { data, error } = await supabase.functions.invoke(
        `${provider}-sync-invoices`
      );
      if (error || data?.error) {
        throw new Error(data?.error || error?.message || "Sync failed");
      }
      toast.success(`Synced ${data.synced ?? 0} invoices`);
      loadIntegrations();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNav />

      <div className="flex-1 max-w-[1200px] mx-auto px-6 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Connections</h1>
          <p className="text-gray-600">Connect your payment platforms to automatically sync invoices</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrationConfigs.map((integration) => {
            const conn = connectedProviders[integration.id];
            const isConnected = !!conn;
            const isBusy = busy === integration.id;

            return (
              <div key={integration.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${integration.color} rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0`}>
                    {integration.logo}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-lg">{integration.name}</h3>
                      {isConnected && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      {!integration.available && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Coming soon</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{integration.description}</p>
                    {isConnected && conn.identifier && (
                      <p className="text-xs text-gray-500 mb-3">Connected as {conn.identifier}</p>
                    )}
                    {!isConnected && <div className="mb-4" />}

                    {isConnected ? (
                      <div className="flex gap-2">
                        <button
                          disabled={isBusy}
                          onClick={() => handleSync(integration.id)}
                          className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition inline-flex items-center gap-2"
                        >
                          {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                          Sync now
                        </button>
                        <button
                          disabled={isBusy}
                          onClick={() => handleDisconnect(integration.id)}
                          className="text-red-600 hover:bg-red-50 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                          Disconnect
                        </button>
                      </div>
                    ) : (
                      <button
                        disabled={!integration.available || isBusy}
                        onClick={integration.id === "paypal" ? handleConnectPayPal : undefined}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition"
                      >
                        {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
