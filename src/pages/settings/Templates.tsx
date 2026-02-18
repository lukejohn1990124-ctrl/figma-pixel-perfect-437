import { useState } from "react";
import SettingsLayout from "@/components/SettingsLayout";
import { Eye, Edit, Code } from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  tone: string;
  subject: string;
  preview: string;
}

const templates: EmailTemplate[] = [
  {
    id: "1",
    name: "Friendly",
    tone: "Casual and warm",
    subject: "Quick reminder about Invoice {invoice_number}",
    preview: "Hi {client_name}, Just wanted to send a friendly reminder that invoice {invoice_number} for ${amount} is now {days_overdue} days past due..."
  },
  {
    id: "2",
    name: "Professional",
    tone: "Formal and business-like",
    subject: "Payment Reminder: Invoice {invoice_number}",
    preview: "Dear {client_name}, This is a reminder that invoice {invoice_number} dated {invoice_date} for ${amount} is currently {days_overdue} days overdue..."
  },
  {
    id: "3",
    name: "Urgent",
    tone: "Direct and firm",
    subject: "Immediate Action Required: Invoice {invoice_number}",
    preview: "Attention {client_name}, Invoice {invoice_number} for ${amount} is significantly overdue by {days_overdue} days. Immediate payment is required..."
  },
];

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  return (
    <SettingsLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-sm text-gray-600 mt-1">Customize reminder messages for different scenarios</p>
        </div>

        <div className="p-6">
          <div className="grid gap-4">
            {templates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{template.name}</h3>
                    <p className="text-sm text-gray-500">{template.tone}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedTemplate(template)} className="text-gray-400 hover:text-blue-600 transition p-2">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="text-gray-400 hover:text-blue-600 transition p-2">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="text-gray-400 hover:text-blue-600 transition p-2">
                      <Code className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">Subject</p>
                  <p className="text-sm text-gray-900 mb-3">{template.subject}</p>
                  <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">Preview</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{template.preview}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTemplate(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{selectedTemplate.name} Template</h3>
              <button onClick={() => setSelectedTemplate(null)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Subject</p>
                <p className="text-sm text-gray-900">{selectedTemplate.subject}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Body</p>
                <p className="text-sm text-gray-700">{selectedTemplate.preview}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </SettingsLayout>
  );
}
