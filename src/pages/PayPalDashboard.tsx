import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { DollarSign, RefreshCw, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import DashboardNav from "@/components/DashboardNav";

export default function PayPalDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [connected] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNav />

      <div className="flex-1 max-w-[1200px] mx-auto px-6 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PayPal Dashboard</h1>
          <p className="text-gray-600">Manage your PayPal invoices and payments</p>
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
              onClick={() => navigate('/connections')}
              className="bg-[#0070ba] hover:bg-[#005ea6] text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Connect PayPal Account
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <p className="text-sm text-gray-600">Connected</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">PayPal</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-600 mb-1">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <p className="text-sm text-gray-600">Last Synced</p>
              </div>
              <p className="text-lg font-medium text-gray-900">Never</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
