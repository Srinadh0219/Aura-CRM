import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Database, ArrowLeft, Table, Settings, Trash2, X, PlusCircle, Check } from 'lucide-react';
import api from '../services/api';

const FIELD_TYPES = [
  { kind: 'String', label: 'Text (Single Line)' },
  { kind: 'Number', label: 'Number / Currency' },
  { kind: 'DateTime', label: 'Date & Time' },
  { kind: 'Boolean', label: 'Checkbox (True / False)' },
  { kind: 'Select', label: 'Dropdown Select' },
  { kind: 'Email', label: 'Email Address' },
  { kind: 'Url', label: 'URL / Link' },
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

  // Fields Drawer / Modal
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldKind, setFieldKind] = useState('String');
  const [isRequired, setIsRequired] = useState(false);
  const [selectOptions, setSelectOptions] = useState('New, Contacted, Qualified, Closed');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    if (!namespaceId) return;
    try {
      const [nsRes, modsRes] = await Promise.all([
        api.get(`/compose/namespaces/${namespaceId}`),
        api.get(`/compose/namespaces/${namespaceId}/modules`),
      ]);
      setNamespace(nsRes.data);
      setModules(modsRes.data);
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/namespaces"
            className="p-2 bg-white rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-800">{namespace?.name || 'Application'}</h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {namespace?.handle}
              </span>
            </div>
            <p className="text-sm text-slate-500">Modules and data schemas in this application.</p>
          </div>
        </div>

        <button
          onClick={() => setShowModuleModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-sm shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add CRM Module
        </button>
      </div>

      {/* Modules List */}
      {loading ? (
        <div className="p-8 text-center text-slate-400">Loading modules...</div>
      ) : modules.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
          <Database className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No modules in this application</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Create CRM modules like <strong>Leads</strong>, <strong>Contacts</strong>, <strong>Accounts</strong>, or <strong>Deals</strong>.
          </p>
          <button
            onClick={() => setShowModuleModal(true)}
            className="px-4 py-2 bg-sky-600 text-white font-medium rounded-xl text-sm"
          >
            Create Module
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-800">{mod.name}</h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                      {mod.handle}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteModule(mod.id, mod.name)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-slate-500 mb-4">{mod.description || 'No description'}</p>

                {/* Fields preview */}
                <div className="mb-4">
                  <div className="text-xs font-semibold uppercase text-slate-400 mb-2">
                    Fields ({mod.fields?.length || 0})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {mod.fields && mod.fields.length > 0 ? (
                      mod.fields.map((f: any) => (
                        <span
                          key={f.id}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1"
                        >
                          <span>{f.label}</span>
                          <span className="text-slate-400 text-[10px]">({f.kind})</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No custom fields added</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedModule(mod)}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Configure Fields
                </button>

                <Link
                  to={`/namespaces/${namespaceId}/modules/${mod.id}/records`}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm"
                >
                  <Table className="w-3.5 h-3.5" />
                  View Records ({mod._count?.records || 0})
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Field Configuration Drawer / Modal */}
      {selectedModule && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Fields for "{selectedModule.name}"</h3>
                  <span className="text-xs font-mono text-slate-400">{selectedModule.handle}</span>
                </div>
                <button onClick={() => setSelectedModule(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Fields Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden mb-6 max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Field Label</th>
                      <th className="p-3">Identifier (Name)</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Required</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {selectedModule.fields?.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-slate-400 italic">
                          No custom fields yet. Add one below!
                        </td>
                      </tr>
                    ) : (
                      selectedModule.fields?.map((f: any) => (
                        <tr key={f.id} className="hover:bg-slate-50">
                          <td className="p-3 font-semibold text-slate-800">{f.label}</td>
                          <td className="p-3 font-mono text-slate-500">{f.name}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-semibold">
                              {f.kind}
                            </span>
                          </td>
                          <td className="p-3">{f.isRequired ? 'Yes' : 'No'}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteField(f.id)}
                              className="text-red-500 hover:text-red-700 font-medium"
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
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-sky-600" /> Add New Field
                </h4>
                {error && <div className="mb-3 p-2 bg-red-50 text-red-700 rounded text-xs">{error}</div>}
                <form onSubmit={handleAddField} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Field Label</label>
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
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Field Identifier</label>
                      <input
                        type="text"
                        required
                        placeholder="deal_value"
                        value={fieldName}
                        onChange={(e) => setFieldName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Field Type</label>
                      <select
                        value={fieldKind}
                        onChange={(e) => setFieldKind(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                      >
                        {FIELD_TYPES.map((t) => (
                          <option key={t.kind} value={t.kind}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {fieldKind === 'Select' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Dropdown Options (comma separated)
                      </label>
                      <input
                        type="text"
                        value={selectOptions}
                        onChange={(e) => setSelectOptions(e.target.value)}
                        placeholder="New, In Progress, Won, Lost"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isRequired}
                        onChange={(e) => setIsRequired(e.target.checked)}
                        className="rounded border-slate-300 text-sky-600"
                      />
                      Required field
                    </label>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow disabled:opacity-50"
                    >
                      {submitting ? 'Adding...' : 'Save Field'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedModule(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Module Create Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Create CRM Module</h3>
              <button onClick={() => setShowModuleModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}

            <form onSubmit={handleCreateModule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Module Name</label>
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
                  placeholder="Deals & Opportunities"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Handle (Identifier)</label>
                <input
                  type="text"
                  required
                  value={modHandle}
                  onChange={(e) => setModHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="deals"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={modDesc}
                  onChange={(e) => setModDesc(e.target.value)}
                  placeholder="Tracks sales pipeline and deals"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModuleModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold shadow disabled:opacity-50"
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
