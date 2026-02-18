import { useState } from "react";
import SettingsLayout from "@/components/SettingsLayout";
import { CheckCircle2, Link2 } from "lucide-react";

const integrationConfigs = [
  { id: "stripe", name: "Stripe", description: "Connect your Stripe account to automatically sync invoices and payment data", logo: "S", color: "bg-blue-600" },
  { id: "paypal", name: "PayPal", description: "Sync PayPal invoices and track payments automatically", logo: "P", color: "bg-blue-500" },
  { id: "wave", name: "Wave", description: "Import Wave accounting invoices and client data", logo: "W", color: "bg-gray-700" },
  { id: "gumroad", name: "Gumroad", description: "Track digital product sales and send payment reminders", logo: "G", color: "bg-pink-500" },
];

export default function IntegrationsPage() {
  const [integrations] = useState(integrationConfigs.map(c => ({ ...c, connected: false })));

  return (
    <SettingsLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
          <p className="text-sm text-gray-600 mt-1">Connect your favorite tools and services</p>
        </div>

        <div className="p-6 grid gap-4">
          {integrations.map((integration) => (
            <div key={integration.id} className="border border-gray-200 rounded-lg p-5 flex items-center gap-4 hover:border-blue-300 transition">
              <div className={`w-12 h-12 ${integration.color} rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0`}>
                {integration.logo}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900">{integration.name}</h3>
                  {integration.connected && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </div>
                <p className="text-sm text-gray-600">{integration.description}</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition">
                <Link2 className="w-4 h-4" />
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </SettingsLayout>
  );
}
