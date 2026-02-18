import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, RefreshCw, ArrowRight, Pencil } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import DashboardNav from "@/components/DashboardNav";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string | null;
  amount: number;
  due_date: string | null;
  status: string;
  external_id: string | null;
  last_reminder_sent: string | null;
}

interface ReminderQueueItem {
  id: string;
  invoice_id: string | null;
  invoice_number: string;
  client_name: string;
  client_email: string | null;
  amount: number;
  scheduled_date: string;
  days_overdue: number;
  recipient_emails: string[];
  template_name: string;
  created_at: string;
  schedule_type: string;
  bulk_group_id: string | null;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [reminders, setReminders] = useState<ReminderQueueItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [invoiceFilter, setInvoiceFilter] = useState("");
  const [activeTab, setActiveTab] = useState<"invoices" | "reminders">("invoices");

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }
    if (user) {
      fetchData();
    }
  }, [user, loading, navigate]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [invoicesRes, remindersRes] = await Promise.all([
        supabase.from('invoices').select('*').order('created_at', { ascending: false }),
        supabase.from('reminder_queue').select('*').order('scheduled_date', { ascending: true }),
      ]);

      if (invoicesRes.data) setInvoices(invoicesRes.data);
      if (remindersRes.data) setReminders(remindersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoadingData(false);
    }
  };

  const filteredInvoices = invoices.filter(inv =>
    inv.client_name.toLowerCase().includes(invoiceFilter.toLowerCase()) ||
    inv.invoice_number.toLowerCase().includes(invoiceFilter.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNav />

      <div className="flex-1 max-w-[1200px] mx-auto px-6 py-8 w-full">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-600 mb-1">Total Invoices</p>
            <p className="text-3xl font-bold text-gray-900">{invoices.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-600 mb-1">Paid</p>
            <p className="text-3xl font-bold text-green-600">{invoices.filter(i => i.status === 'paid').length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-600 mb-1">Overdue</p>
            <p className="text-3xl font-bold text-red-600">{invoices.filter(i => i.status === 'overdue').length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-600 mb-1">Active Reminders</p>
            <p className="text-3xl font-bold text-blue-600">{reminders.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("invoices")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "invoices" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Invoices ({invoices.length})
          </button>
          <button
            onClick={() => setActiveTab("reminders")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "reminders" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Reminder Queue ({reminders.length})
          </button>
        </div>

        {activeTab === "invoices" && (
          <div className="bg-white rounded-xl border border-gray-200">
            {/* Search & Actions */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={invoiceFilter}
                  onChange={(e) => setInvoiceFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={fetchData}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            {/* Table */}
            {loadingData ? (
              <div className="p-8 text-center text-gray-500">Loading invoices...</div>
            ) : filteredInvoices.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">No invoices found. Connect a payment platform to sync your invoices.</p>
                <button
                  onClick={() => navigate('/connections')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition"
                >
                  Connect Platform <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{invoice.invoice_number}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{invoice.client_name}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">${Number(invoice.amount).toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{invoice.due_date || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Set Reminder
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "reminders" && (
          <div className="bg-white rounded-xl border border-gray-200">
            {reminders.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">No reminders scheduled yet. Create a reminder from an invoice.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Overdue</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Template</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reminders.map((reminder) => (
                      <tr key={reminder.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{reminder.invoice_number}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{reminder.client_name}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{reminder.scheduled_date}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{reminder.days_overdue} days</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{reminder.template_name || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
