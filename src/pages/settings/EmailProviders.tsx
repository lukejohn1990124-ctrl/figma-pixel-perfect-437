import { useState } from "react";
import SettingsLayout from "@/components/SettingsLayout";
import { CheckCircle2, AlertCircle } from "lucide-react";

const providers = [
  { id: "sendgrid", name: "SendGrid", type: "api" as const },
  { id: "mailchimp", name: "Mailchimp", type: "oauth" as const },
  { id: "sendinblue", name: "Brevo", type: "api" as const },
  { id: "postmark", name: "Postmark", type: "api" as const },
  { id: "gmail", name: "Gmail", type: "oauth" as const },
  { id: "outlook", name: "Outlook", type: "smtp" as const },
];

export default function EmailProvidersPage() {
  const [configured] = useState<Record<string, boolean>>({});

  return (
    <SettingsLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Email Providers</h1>
          <p className="text-sm text-gray-600 mt-1">Configure how reminder emails are sent</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providers.map((provider) => (
              <div key={provider.id} className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">{provider.name}</h3>
                  {configured[provider.id] ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {provider.type === 'api' ? 'API Key' : provider.type === 'oauth' ? 'OAuth' : 'SMTP'} integration
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition w-full">
                  {configured[provider.id] ? 'Configure' : 'Set Up'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
