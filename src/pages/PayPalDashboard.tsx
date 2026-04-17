import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { DollarSign, RefreshCw, CheckCircle2, Clock, Loader2 } from "lucide-react";
import DashboardNav from "@/components/DashboardNav";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string | null;
  amount: number;
  status: string;
  due_date: string | null;
  payment_date: string | null;
}

export default function PayPalDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [connected, setConnected] = useState(false);
  const [identifier, setIdentifier] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    load();
  }, [user, authLoading]);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data: integ } = await supabase
      .from("integrations")
      .select("user_identifier, last_synced_at, is_connected")
      .eq("user_id", user.id)
      .eq("provider", "paypal")
      .maybeSingle();

    if (integ?.is_connected) {
      setConnected(true);
      setIdentifier(integ.user_identifier);
      setLastSynced(integ.last_synced_at);

      const { data: inv } = await supabase
        .from("invoices")
        .select("id, invoice_number, client_name, client_email, amount, status, due_date, payment_date")
        .eq("user_id", user.id)
        .not("external_id", "is", null)
        .order("created_at", { ascending: false });
      setInvoices(inv ?? []);
    } else {
      setConnected(false);
    }
    setLoading(false);
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("paypal-sync-invoices");
      if (error || data?.error) throw new Error(data?.error || error?.message);
      toast.success(`Synced ${data.synced} invoices`);
      await load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSyncing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNav />

      <div className="flex-1 max-w-[1200px] mx-auto px-6 py-8 w-full">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">PayPal Dashboard</h1>
            <p className="text-gray-600">Manage your PayPal invoices and payments</p>
          </div>
          {connected && (
            <button
              onClick={handleSync}
              disabled={syncing}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2"
            >
              {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Sync invoices
            </button>
          )}
        </div>

        {!connected ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect PayPal</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Connect your PayPal account to automatically sync invoices and track payment statuses.
            </p>
            <button
              onClick={() => navigate("/connections")}
              className="bg-[#0070ba] hover:bg-[#005ea6] text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Connect PayPal Account
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <p className="text-sm text-gray-600">Connected</p>
                </div>
                <p className="text-lg font-bold text-gray-900 truncate">{identifier ?? "PayPal"}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-600 mb-1">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <p className="text-sm text-gray-600">Last Synced</p>
                </div>
                <p className="text-lg font-medium text-gray-900">
                  {lastSynced ? new Date(lastSynced).toLocaleString() : "Never"}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-900">Invoices</h2>
              </div>
              {invoices.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No invoices yet. Click "Sync invoices" to fetch from PayPal.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Invoice #</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Client</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Amount</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Due</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="border-t border-gray-100">
                          <td className="px-4 py-3 font-mono text-xs text-gray-700">{inv.invoice_number}</td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{inv.client_name}</div>
                            {inv.client_email && <div className="text-xs text-gray-500">{inv.client_email}</div>}
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900">${inv.amount.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={inv.status} />
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {inv.due_date ? new Date(inv.due_date).toLocaleDateString() : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-gray-100 text-gray-600",
    draft: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}
