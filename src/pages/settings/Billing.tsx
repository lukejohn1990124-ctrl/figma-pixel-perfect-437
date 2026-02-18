import SettingsLayout from "@/components/SettingsLayout";
import { CheckCircle2, Download } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    features: ["Up to 5 invoices/month", "Basic email templates", "Single integration", "Email support"],
    current: false
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    features: ["Unlimited invoices", "Custom email templates", "All integrations", "Priority support", "Advanced analytics"],
    current: true,
    popular: true
  },
  {
    name: "Team",
    price: "$99",
    period: "/month",
    features: ["Everything in Pro", "Multi-user access", "API access", "Dedicated support", "Custom branding"],
    current: false
  }
];

const invoices = [
  { id: "1", date: "Jan 1, 2025", amount: "$49.00", status: "Paid" },
  { id: "2", date: "Dec 1, 2024", amount: "$49.00", status: "Paid" },
  { id: "3", date: "Nov 1, 2024", amount: "$49.00", status: "Paid" },
];

export default function BillingPage() {
  return (
    <SettingsLayout>
      <div className="space-y-6">
        {/* Current Plan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Current Plan</h2>
          <div className="flex items-center justify-between p-5 bg-blue-50 border border-blue-200 rounded-lg">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-2xl font-bold text-gray-900">Pro Plan</h3>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">Active</span>
              </div>
              <p className="text-gray-600">$49/month • Next billing: Feb 1, 2025</p>
            </div>
            <button className="text-sm text-gray-600 hover:text-gray-900 transition px-4 py-2 border border-gray-300 rounded-lg font-medium bg-white">
              Manage Subscription
            </button>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Usage This Month</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Invoices Tracked</p>
              <p className="text-2xl font-bold text-gray-900">127</p>
              <p className="text-xs text-gray-500 mt-1">Unlimited on Pro plan</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Reminders Sent</p>
              <p className="text-2xl font-bold text-gray-900">43</p>
              <p className="text-xs text-gray-500 mt-1">Unlimited on Pro plan</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Integrations Active</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-xs text-gray-500 mt-1">All available on Pro plan</p>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div key={plan.name} className={`border rounded-xl p-6 relative ${plan.current ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200'}`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-3xl font-bold text-gray-900 mb-4">
                  {plan.price}<span className="text-sm font-normal text-gray-500">{plan.period}</span>
                </p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2 rounded-lg text-sm font-medium transition ${
                  plan.current 
                    ? 'bg-gray-200 text-gray-500 cursor-default' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`} disabled={plan.current}>
                  {plan.current ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Billing History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100">
                    <td className="px-4 py-3 text-sm text-gray-900">{invoice.date}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{invoice.amount}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1">
                        <Download className="w-4 h-4" /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
