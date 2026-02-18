import { useState } from "react";
import { CheckCircle2, ExternalLink, AlertCircle, Link2 } from "lucide-react";
import DashboardNav from "@/components/DashboardNav";

interface Integration {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  logo: string;
  color: string;
}

const integrationConfigs = [
  {
    id: "paypal",
    name: "PayPal",
    description: "Sync PayPal invoices and track payments automatically",
    logo: "P",
    color: "bg-[#0070ba]"
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Connect your Stripe account to automatically sync invoices and payment data",
    logo: "S",
    color: "bg-[#635bff]"
  },
  {
    id: "wave",
    name: "Wave",
    description: "Import Wave accounting invoices and client data",
    logo: "W",
    color: "bg-gray-700"
  },
  {
    id: "gumroad",
    name: "Gumroad",
    description: "Track digital product sales and send payment reminders",
    logo: "G",
    color: "bg-pink-500"
  },
];

export default function ConnectionsPage() {
  const [integrations] = useState<Integration[]>(
    integrationConfigs.map(config => ({ ...config, connected: false }))
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNav />

      <div className="flex-1 max-w-[1200px] mx-auto px-6 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Connections</h1>
          <p className="text-gray-600">Connect your payment platforms to automatically sync invoices</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrations.map((integration) => (
            <div key={integration.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${integration.color} rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0`}>
                  {integration.logo}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-lg">{integration.name}</h3>
                    {integration.connected && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                  
                  {integration.connected ? (
                    <div className="flex gap-2">
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition">
                        Sync Now
                      </button>
                      <button className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition">
                        Disconnect
                      </button>
                    </div>
                  ) : (
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition">
                      <Link2 className="w-4 h-4" />
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
