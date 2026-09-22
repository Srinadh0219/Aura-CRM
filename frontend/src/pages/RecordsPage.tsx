import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, ArrowLeft, Search, Edit2, Trash2, X, FileText, CheckCircle } from 'lucide-react';
import api from '../services/api';

export const RecordsPage: React.FC = () => {
  const { namespaceId, moduleId } = useParams<{ namespaceId: string; moduleId: string }>();
  const [moduleData, setModuleData] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({ total: 0, page: 1, limit: 20 });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Record Form Modal (Create & Edit)
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRecords = async (query = '') => {
    if (!moduleId) return;
    try {
      const res = await api.get(`/compose/modules/${moduleId}/records`, {
        params: { query, page: 1, limit: 50 },
      });
      setRecords(res.data.data);
      setMeta(res.data.meta);
      setModuleData(res.data.module);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [moduleId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecords(searchQuery);
  };

  const openCreateModal = () => {
    setEditingRecord(null);
    setFormData({});
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (record: any) => {
    setEditingRecord(record);
    setFormData(record.values || {});
    setFormError('');
    setShowModal(true);
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      if (editingRecord) {
        await api.patch(`/compose/modules/${moduleId}/records/${editingRecord.id}`, {
          values: formData,
        });
      } else {
        await api.post(`/compose/modules/${moduleId}/records`, {
          values: formData,
        });
      }
      setShowModal(false);
      fetchRecords(searchQuery);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await api.delete(`/compose/modules/${moduleId}/records/${recordId}`);
      fetchRecords(searchQuery);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete record');
    }
  };

  const fields = moduleData?.fields || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to={`/namespaces/${namespaceId}/modules`}
            className="p-2 bg-white rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-800">{moduleData?.name || 'Records'}</h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {moduleData?.handle}
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Total {meta.total} records • Dynamic Low-Code Table View
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-sm shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          New {moduleData?.name || 'Record'}
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </form>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              fetchRecords('');
            }}
            className="text-xs text-slate-500 hover:text-slate-700 font-semibold"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Dynamic Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">#</th>
                {fields.map((f: any) => (
                  <th key={f.id} className="p-3.5">
                    {f.label}
                  </th>
                ))}
                <th className="p-3.5">Created By</th>
                <th className="p-3.5">Created At</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={fields.length + 4} className="p-8 text-center text-slate-400">
                    Loading records...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={fields.length + 4} className="p-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No records found. Click "New {moduleData?.name || 'Record'}" to add your first record.
                  </td>
                </tr>
              ) : (
                records.map((rec: any, idx: number) => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 text-slate-400 font-mono">{idx + 1}</td>
                    {fields.map((f: any) => {
                      const val = rec.values ? rec.values[f.name] : null;
                      return (
                        <td key={f.id} className="p-3.5 font-medium text-slate-800 max-w-xs truncate">
                          {f.kind === 'Boolean' ? (
                            val ? (
                              <span className="text-emerald-600 font-bold">Yes</span>
                            ) : (
                              <span className="text-slate-400">No</span>
                            )
                          ) : f.kind === 'Number' && typeof val === 'number' ? (
                            val.toLocaleString()
                          ) : val !== null && val !== undefined ? (
                            String(val)
                          ) : (
                            <span className="text-slate-300 italic">—</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-3.5 text-slate-600">
                      {rec.createdBy ? `${rec.createdBy.firstName} ${rec.createdBy.lastName}` : 'System'}
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {new Date(rec.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(rec)}
                        className="p-1 text-slate-500 hover:text-sky-600 rounded transition-colors"
                        title="Edit Record"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRecord(rec.id)}
                        className="p-1 text-slate-500 hover:text-red-600 rounded transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Form Modal (Create / Edit) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                {editingRecord ? `Edit ${moduleData?.name}` : `New ${moduleData?.name}`}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveRecord} className="space-y-4">
              {fields.length === 0 ? (
                <p className="text-sm text-slate-500 italic p-4 text-center">
                  This module has no fields configured yet. Please configure fields in the module settings first.
                </p>
              ) : (
                fields.map((f: any) => {
                  const currentValue = formData[f.name] ?? '';

                  return (
                    <div key={f.id}>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {f.label} {f.isRequired && <span className="text-red-500">*</span>}
                      </label>

                      {f.kind === 'Select' ? (
                        <select
                          required={f.isRequired}
                          value={currentValue}
                          onChange={(e) => handleInputChange(f.name, e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        >
                          <option value="">-- Select an option --</option>
                          {(f.options?.options || []).map((opt: string) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : f.kind === 'Boolean' ? (
                        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer pt-1">
                          <input
                            type="checkbox"
                            checked={Boolean(formData[f.name])}
                            onChange={(e) => handleInputChange(f.name, e.target.checked)}
                            className="rounded border-slate-300 text-sky-600 w-4 h-4"
                          />
                          <span>Yes</span>
                        </label>
                      ) : f.kind === 'Number' ? (
                        <input
                          type="number"
                          step="any"
                          required={f.isRequired}
                          value={currentValue}
                          onChange={(e) => handleInputChange(f.name, e.target.value)}
                          placeholder="0"
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        />
                      ) : f.kind === 'DateTime' ? (
                        <input
                          type="datetime-local"
                          required={f.isRequired}
                          value={currentValue ? currentValue.slice(0, 16) : ''}
                          onChange={(e) => handleInputChange(f.name, e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        />
                      ) : (
                        <input
                          type={f.kind === 'Email' ? 'email' : 'text'}
                          required={f.isRequired}
                          value={currentValue}
                          onChange={(e) => handleInputChange(f.name, e.target.value)}
                          placeholder={`Enter ${f.label.toLowerCase()}...`}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        />
                      )}
                    </div>
                  );
                })
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || fields.length === 0}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-sm shadow disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingRecord ? 'Update Record' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
