import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Plus,
  ArrowLeft,
  Settings,
  Table,
  Trash2,
  Database,
  X,
  PlusCircle,
  AlertCircle,
  Sliders,
  Layers,
} from 'lucide-react';
import api from '../services/api';

const FIELD_TYPES = [
  { kind: 'String', label: 'Text (String)' },
  { kind: 'Number', label: 'Numeric (Number)' },
  { kind: 'DateTime', label: 'Date / Timestamp' },
  { kind: 'Boolean', label: 'Boolean (Yes/No)' },
  { kind: 'Select', label: 'Dropdown Select' },
  { kind: 'Email', label: 'Email' },
  { kind: 'Url', label: 'Web URL' },
];

export const ModulesPage: React.FC = () => {
  const { namespaceId } = useParams<{ namespaceId: string }>();
  const [namespace, setNamespace] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Module Modal
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [modName, setModName] = useState('');
  const [modHandle, setModHandle] = useState('');
  const [modDesc, setModDesc] = useState('');

  // Fields Drawer/Modal
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldKind, setFieldKind] = useState('String');
  const [isRequired, setIsRequired] = useState(false);
  const [selectOptions, setSelectOptions] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    if (!namespaceId) return;
    try {
      const [nsRes, modRes] = await Promise.all([
        api.get(`/compose/namespaces/${namespaceId}`),
        api.get(`/compose/namespaces/${namespaceId}/modules`),
      ]);
      setNamespace(nsRes.data);
      setModules(modRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [namespaceId]);

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post(`/compose/namespaces/${namespaceId}/modules`, {
        name: modName,
        handle: modHandle,
        description: modDesc,
      });
      setShowModuleModal(false);
      setModName('');
      setModHandle('');
      setModDesc('');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create module');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModule) return;
    setError('');
    setSubmitting(true);
    try {
      const payload: any = {
        name: fieldName,
        label: fieldLabel,
        kind: fieldKind,
        isRequired,
      };

      if (fieldKind === 'Select') {
        payload.options = {
          options: selectOptions.split(',').map((s) => s.trim()).filter(Boolean),
        };
      }

      await api.post(`/compose/modules/${selectedModule.id}/fields`, payload);
      setShowFieldModal(false);
      setFieldName('');
      setFieldLabel('');
      setFieldKind('String');
      setIsRequired(false);
      setSelectOptions('');

      // Refresh selected module and list
      const updated = await api.get(`/compose/namespaces/${namespaceId}/modules/${selectedModule.id}`);
      setSelectedModule(updated.data);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add field');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    if (!confirm('Are you sure you want to delete this field?')) return;
    try {
      await api.delete(`/compose/modules/${selectedModule.id}/fields/${fieldId}`);
      const updated = await api.get(`/compose/namespaces/${namespaceId}/modules/${selectedModule.id}`);
      setSelectedModule(updated.data);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete field');
    }
  };

  const handleDeleteModule = async (moduleId: string, name: string) => {
    if (!confirm(`Delete module "${name}" and all associated records?`)) return;
    try {
      await api.delete(`/compose/namespaces/${namespaceId}/modules/${moduleId}`);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete module');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/namespaces"
            className="p-2.5 bg-slate-900 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">{namespace?.name || 'Application'}</h1>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
                {namespace?.handle}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Modules and dynamic data schemas in this application.</p>
          </div>
        </div>

        <button
          onClick={() => setShowModuleModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add CRM Module</span>
        </button>
      </div>

      {/* Modules List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading modules...</div>
      ) : modules.length === 0 ? (
        <div className="bg-slate-900/60 border border-dashed border-white/10 rounded-3xl p-12 text-center space-y-3">
          <Database className="w-12 h-12 text-slate-600 mx-auto mb-2" />
          <h3 className="text-base font-bold text-white">No modules in this application</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Create CRM modules like <strong>Leads</strong>, <strong>Contacts</strong>, <strong>Accounts</strong>, or <strong>Deals</strong>.
          </p>
          <button
            onClick={() => setShowModuleModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Module
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className="bg-slate-900/90 border border-white/10 hover:border-sky-500/40 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between group backdrop-blur-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                      {mod.name}
                    </h3>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 text-sky-400 border border-white/10">
                      {mod.handle}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteModule(mod.id, mod.name)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-400 mb-4">{mod.description || 'No description provided'}</p>

                {/* Fields preview */}
                <div className="mb-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-2">
                    Fields ({mod.fields?.length || 0})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {mod.fields && mod.fields.length > 0 ? (
                      mod.fields.map((f: any) => (
                        <span
                          key={f.id}
                          className="px-2.5 py-1 bg-white/5 text-slate-300 border border-white/10 rounded-lg text-[11px] font-medium flex items-center gap-1 font-mono"
                        >
                          <span>{f.label}</span>
                          <span className="text-sky-400 text-[10px]">({f.kind})</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">No custom fields added</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedModule(mod)}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 bg-white/5 hover:bg-white/10 text-slate-200 font-semibold rounded-xl text-xs transition-colors border border-white/5"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Configure Fields</span>
                </button>

                <Link
                  to={`/namespaces/${namespaceId}/modules/${mod.id}/records`}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-sky-500/20"
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>View Records ({mod._count?.records || 0})</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Field Configuration Drawer / Modal */}
      {selectedModule && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-white/10 max-h-[90vh] flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">Fields for "{selectedModule.name}"</h3>
                  <span className="text-xs font-mono text-sky-400">{selectedModule.handle}</span>
                </div>
                <button onClick={() => setSelectedModule(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Fields Table */}
              <div className="border border-white/10 rounded-2xl overflow-hidden mb-6 max-h-52 overflow-y-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-white/10">
                    <tr>
                      <th className="p-3">Field Label</th>
                      <th className="p-3">Identifier</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Required</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {selectedModule.fields?.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-slate-500 italic">
                          No custom fields yet. Add one below!
                        </td>
                      </tr>
                    ) : (
                      selectedModule.fields?.map((f: any) => (
                        <tr key={f.id} className="hover:bg-white/[0.02]">
                          <td className="p-3 font-semibold text-white">{f.label}</td>
                          <td className="p-3 font-mono text-slate-400">{f.name}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-mono text-[11px] border border-sky-500/20">
                              {f.kind}
                            </span>
                          </td>
                          <td className="p-3">{f.isRequired ? 'Yes' : 'No'}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteField(f.id)}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Add Field Form */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10">
                <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                  <PlusCircle className="w-4 h-4 text-sky-400" /> Add New Field
                </h4>
                {error && <div className="mb-3 p-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs">{error}</div>}
                <form onSubmit={handleAddField} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Field Label</label>
                      <input
                        type="text"
                        required
                        placeholder="Deal Value"
                        value={fieldLabel}
                        onChange={(e) => {
                          setFieldLabel(e.target.value);
                          if (!fieldName) {
                            setFieldName(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_'));
                          }
                        }}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:border-sky-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Identifier</label>
                      <input
                        type="text"
                        required
                        placeholder="deal_value"
                        value={fieldName}
                        onChange={(e) => setFieldName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-white/10 rounded-xl font-mono text-xs text-sky-400 focus:border-sky-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Field Type</label>
                      <select
                        value={fieldKind}
                        onChange={(e) => setFieldKind(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:border-sky-500 focus:outline-none"
                      >
                        {FIELD_TYPES.map((t) => (
                          <option key={t.kind} value={t.kind} className="bg-slate-900 text-white">
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {fieldKind === 'Select' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Dropdown Options (comma separated)
                      </label>
                      <input
                        type="text"
                        value={selectOptions}
                        onChange={(e) => setSelectOptions(e.target.value)}
                        placeholder="New, In Progress, Won, Lost"
                        className="w-full px-3 py-1.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isRequired}
                        onChange={(e) => setIsRequired(e.target.checked)}
                        className="rounded border-white/10 bg-slate-900 text-sky-600 focus:ring-0"
                      />
                      <span>Required field</span>
                    </label>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? 'Adding...' : 'Save Field'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedModule(null)}
                className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Module Create Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Create CRM Module</h3>
                <p className="text-xs text-slate-400">Define a new table entity</p>
              </div>
              <button onClick={() => setShowModuleModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateModule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Module Name</label>
                <input
                  type="text"
                  required
                  value={modName}
                  onChange={(e) => {
                    setModName(e.target.value);
                    if (!modHandle) {
                      setModHandle(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_'));
                    }
                  }}
                  placeholder="e.g. Deals & Opportunities"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-white/10 rounded-xl focus:border-sky-500 focus:outline-none text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Handle (Identifier)</label>
                <input
                  type="text"
                  required
                  value={modHandle}
                  onChange={(e) => setModHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="deals"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-white/10 rounded-xl font-mono text-xs text-sky-400 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  value={modDesc}
                  onChange={(e) => setModDesc(e.target.value)}
                  placeholder="Tracks sales pipeline and deals"
                  rows={3}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-white/10 rounded-xl focus:border-sky-500 focus:outline-none text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModuleModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Creating...' : 'Create Module'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
