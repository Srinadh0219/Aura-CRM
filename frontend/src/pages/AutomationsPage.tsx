import React, { useEffect, useState } from 'react';
import {
  Zap,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Database,
  Sliders,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AutomationsPage: React.FC = () => {
  const { user } = useAuth();
  const [rules, setRules] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Rule Form State
  const [name, setName] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [triggerEvent, setTriggerEvent] = useState('RECORD_CREATED');
  const [conditionField, setConditionField] = useState('');
  const [conditionOperator, setConditionOperator] = useState('EQUALS');
  const [conditionValue, setConditionValue] = useState('');
  const [targetField, setTargetField] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [error, setError] = useState('');

  const isAdminOrSuper = user?.role === 'SUPERADMIN' || user?.role === 'ADMIN';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rulesRes, nsRes] = await Promise.all([
        api.get('/automations'),
        api.get('/compose/namespaces'),
      ]);
      setRules(rulesRes.data);

      // Fetch all modules across namespaces
      const allMods: any[] = [];
      for (const ns of nsRes.data) {
        const modRes = await api.get(`/compose/namespaces/${ns.id}/modules`);
        allMods.push(...modRes.data.map((m: any) => ({ ...m, namespaceName: ns.name })));
      }
      setModules(allMods);
      if (allMods.length > 0 && !moduleId) {
        setModuleId(allMods[0].id);
      }
    } catch (err) {
      console.error('Failed to load automation data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const actionPayload = JSON.stringify({
        targetField,
        value: targetValue,
      });

      await api.post('/automations', {
        moduleId,
        name,
        triggerEvent,
        conditionField: conditionField || undefined,
        conditionOperator: conditionOperator || undefined,
        conditionValue: conditionValue || undefined,
        actionType: 'SET_FIELD',
        actionPayload,
        isActive: true,
      });

      setIsModalOpen(false);
      setName('');
      setConditionField('');
      setConditionValue('');
      setTargetField('');
      setTargetValue('');
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create automation rule');
    }
  };

  const handleToggleActive = async (rule: any) => {
    try {
      await api.patch(`/automations/${rule.id}`, { isActive: !rule.isActive });
      setRules(
        rules.map((r) => (r.id === rule.id ? { ...r, isActive: !r.isActive } : r)),
      );
    } catch (err) {
      console.error('Failed to toggle rule', err);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this automation rule?')) return;
    try {
      await api.delete(`/automations/${id}`);
      setRules(rules.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Failed to delete rule', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Automations & Workflow Rules</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-mono border border-purple-500/20 font-bold">
              Low-Code Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Build event-driven rules to auto-update records, calculate fields, and streamline CRM workflows
          </p>
        </div>

        {isAdminOrSuper && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold text-xs shadow-lg shadow-purple-500/20 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Automation Rule</span>
          </button>
        )}
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 p-12 text-center text-xs text-slate-400">
            Loading automation rules...
          </div>
        ) : rules.length === 0 ? (
          <div className="col-span-2 rounded-2xl bg-slate-900/60 border border-white/10 p-12 text-center space-y-3">
            <Zap className="w-10 h-10 text-purple-400/50 mx-auto" />
            <div className="text-sm font-semibold text-white">No automation rules active</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Automate routine CRM tasks by setting up triggers on Record Creation or Updates.
            </p>
          </div>
        ) : (
          rules.map((rule) => {
            let payload: any = {};
            try {
              payload = JSON.parse(rule.actionPayload);
            } catch {}

            return (
              <div
                key={rule.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-purple-500/30 transition-all shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {rule.module?.name || 'Global Module'}
                    </span>
                    <button
                      onClick={() => handleToggleActive(rule)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-colors ${
                        rule.isActive
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border-white/10'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          rule.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                        }`}
                      />
                      <span>{rule.isActive ? 'Active' : 'Paused'}</span>
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2">{rule.name}</h3>

                  {/* Visual Flow Diagram */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">WHEN</span>
                      <span className="px-2 py-0.5 rounded bg-white/5 text-sky-300 font-mono text-[11px]">
                        {rule.triggerEvent}
                      </span>
                    </div>

                    {rule.conditionField && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">IF</span>
                        <span className="font-mono text-emerald-300">
                          [{rule.conditionField}] {rule.conditionOperator} "{rule.conditionValue}"
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">THEN</span>
                      <span className="font-mono text-purple-300">
                        Set [{payload.targetField || 'Field'}] = "{payload.value || 'Value'}"
                      </span>
                    </div>
                  </div>
                </div>

                {isAdminOrSuper && (
                  <div className="pt-3 border-t border-white/5 flex items-center justify-end">
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                      title="Delete rule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Create Automation Rule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Create Automation Rule</h2>
                  <p className="text-xs text-slate-400">Trigger actions automatically based on record changes</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateRule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Set Priority to Urgent for Enterprise Deals"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Module</label>
                  <select
                    value={moduleId}
                    onChange={(e) => setModuleId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    {modules.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.namespaceName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Trigger Event</label>
                  <select
                    value={triggerEvent}
                    onChange={(e) => setTriggerEvent(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="RECORD_CREATED">When Record is Created</option>
                    <option value="RECORD_UPDATED">When Record is Updated</option>
                  </select>
                </div>
              </div>

              {/* Condition */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-2.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  If Condition (Optional)
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Field name (e.g. stage)"
                    value={conditionField}
                    onChange={(e) => setConditionField(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white"
                  />
                  <select
                    value={conditionOperator}
                    onChange={(e) => setConditionOperator(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white"
                  >
                    <option value="EQUALS">Equals</option>
                    <option value="NOT_EQUALS">Does Not Equal</option>
                    <option value="CONTAINS">Contains</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Value (e.g. Won)"
                    value={conditionValue}
                    onChange={(e) => setConditionValue(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              {/* Action */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-2.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Then Action (Auto Set Field)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Target Field (e.g. priority)"
                    value={targetField}
                    onChange={(e) => setTargetField(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="New Value (e.g. High)"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-purple-500/20 cursor-pointer"
                >
                  Save Automation Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
