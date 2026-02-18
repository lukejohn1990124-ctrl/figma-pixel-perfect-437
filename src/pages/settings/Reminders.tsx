import { useState } from "react";
import SettingsLayout from "@/components/SettingsLayout";
import { Plus, Trash2 } from "lucide-react";

interface ReminderRule {
  id: string;
  name: string;
  daysOverdue: number;
  enabled: boolean;
  template: string;
}

const defaultRules: ReminderRule[] = [
  { id: "1", name: "Early Reminder", daysOverdue: 2, enabled: true, template: "Friendly" },
  { id: "2", name: "First Follow-up", daysOverdue: 7, enabled: true, template: "Professional" },
  { id: "3", name: "Final Notice", daysOverdue: 14, enabled: true, template: "Urgent" },
];

export default function RemindersPage() {
  const [rules, setRules] = useState<ReminderRule[]>(defaultRules);

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  return (
    <SettingsLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reminder Rules</h1>
            <p className="text-sm text-gray-600 mt-1">Set automated schedules for payment reminders</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition">
            <Plus className="w-4 h-4" /> Add Rule
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="border border-gray-200 rounded-lg p-5 flex items-center justify-between hover:border-blue-300 transition">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      rule.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {rule.enabled ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Send after <span className="font-medium">{rule.daysOverdue} days</span> overdue using <span className="font-medium">{rule.template}</span> template
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      rule.enabled ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      rule.enabled ? "translate-x-6" : "translate-x-1"
                    }`} />
                  </button>
                  <button onClick={() => deleteRule(rule.id)} className="text-gray-400 hover:text-red-500 transition p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
