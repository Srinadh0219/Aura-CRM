import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Plus,
  ArrowLeft,
  Search,
  Edit2,
  Trash2,
  X,
  FileText,
  CheckCircle,
  Download,
  Upload,
  History,
  Clock,
  Sparkles,
  Filter,
} from 'lucide-react';
import api from '../services/api';
import { CsvImportModal } from '../components/CsvImportModal';

export const RecordsPage: React.FC = () => {
  const { namespaceId, moduleId } = useParams<{ namespaceId: string; moduleId: string }>();
  const [moduleData, setModuleData] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({ total: 0, page: 1, limit: 20 });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Record Audit History Drawer
  const [historyRecordId, setHistoryRecordId] = useState<string | null>(null);
  const [recordLogs, setRecordLogs] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchRecords = async (query = '') => {
    if (!moduleId) return;
    try {
      const res = await api.get(`/compose/modules/${moduleId}/records`, {
        params: { query, page: 1, limit: 100 },
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

  // CSV Export Engine
  const handleExportCsv = () => {
    if (!records.length || !moduleData?.fields) return;

    const fields = moduleData.fields;
    const headerRow = fields.map((f: any) => `"${f.label || f.name}"`).join(',');

    const rows = records.map((r: any) => {
      return fields
        .map((f: any) => {
          const val = r.values?.[f.name];
          if (val === undefined || val === null) return '""';
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headerRow, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${moduleData.handle || 'crm'}_records_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fetch record audit history
  const openHistoryDrawer = async (recordId: string) => {
    setHistoryRecordId(recordId);
    setLoadingHistory(true);
    try {
      const res = await api.get(`/audit/entity/RECORD/${recordId}`);
      setRecordLogs(res.data);
    } catch (err) {
      console.error('Failed to load record history', err);
    } finally {
      setLoadingHistory(false);
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
            className="p-2.5 bg-slate-900 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {moduleData?.name || 'Records'}
              </h1>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
                {moduleData?.handle}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Total {meta.total} records • Dynamic Type-Safe JSONB Engine
            </p>
          </div>
        </div>

        {/* Action Buttons: Import, Export, New Record */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            disabled={records.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white font-semibold rounded-xl text-xs shadow-sm transition-all disabled:opacity-40 cursor-pointer"
            title="Download records as CSV"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white font-semibold rounded-xl text-xs shadow-sm transition-all cursor-pointer"
            title="Import records from CSV"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New {moduleData?.name || 'Record'}</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/90 p-3 rounded-2xl border border-white/10 shadow-sm flex items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search across all fields..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </form>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              fetchRecords('');
            }}
            className="text-xs text-sky-400 hover:underline px-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Records Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading records...</div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-white">No records found</div>
            <p className="text-xs text-slate-400">
              Create your first record manually or import a batch via CSV.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-white/10">
                <tr>
                  <th className="px-5 py-3">#</th>
                  {fields.map((f: any) => (
                    <th key={f.id} className="px-5 py-3 font-semibold">
                      {f.label}
                    </th>
                  ))}
                  <th className="px-5 py-3">Created By</th>
                  <th className="px-5 py-3">Created At</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {records.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 font-mono text-slate-500">{idx + 1}</td>
                    {fields.map((f: any) => {
                      const val = r.values?.[f.name];
                      return (
                        <td key={f.id} className="px-5 py-3 font-medium text-white max-w-[200px] truncate">
                          {val !== undefined && val !== null ? String(val) : '—'}
                        </td>
                      );
                    })}
                    <td className="px-5 py-3 text-slate-400 font-mono">
                      {r.createdBy ? `${r.createdBy.firstName} ${r.createdBy.lastName}` : 'System'}
                    </td>
                    <td className="px-5 py-3 text-slate-500 font-mono">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openHistoryDrawer(r.id)}
                          title="View audit history"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-500/20 text-slate-400 hover:text-purple-300 border border-white/5 transition-colors"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(r)}
                          title="Edit record"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-sky-500/20 text-slate-400 hover:text-sky-300 border border-white/5 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(r.id)}
                          title="Delete record"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300 border border-white/5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {editingRecord ? `Edit ${moduleData?.name}` : `New ${moduleData?.name}`}
                </h2>
                <p className="text-xs text-slate-400">Fill in the dynamic module fields</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveRecord} className="space-y-4">
              {fields.map((field: any) => (
                <div key={field.id}>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {field.label}{' '}
                    {field.isRequired && <span className="text-red-400">*</span>}
                  </label>
                  {field.kind === 'Select' && field.options ? (
                    <select
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      required={field.isRequired}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-sky-500"
                    >
                      <option value="">-- Select --</option>
                      {(Array.isArray(field.options) ? field.options : []).map((opt: string) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.kind === 'Number' ? 'number' : field.kind === 'DateTime' ? 'date' : 'text'}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      required={field.isRequired}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-sky-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      <CsvImportModal
        moduleId={moduleId!}
        fields={fields}
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={() => fetchRecords(searchQuery)}
      />

      {/* Record Audit History Drawer */}
      {historyRecordId && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border-l border-white/10 p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Record Audit Timeline</h3>
                    <p className="text-xs text-slate-400 font-mono">ID: {historyRecordId.slice(0, 12)}...</p>
                  </div>
                </div>
                <button
                  onClick={() => setHistoryRecordId(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {loadingHistory ? (
                <div className="p-8 text-center text-xs text-slate-400">Loading history...</div>
              ) : recordLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">No audit events recorded for this record.</div>
              ) : (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                  {recordLogs.map((log) => (
                    <div key={log.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{log.userName}</span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-[11px] text-purple-400 font-mono font-semibold uppercase">
                        {log.action}
                      </div>

                      {log.details?.diff && (
                        <div className="mt-2 pt-2 border-t border-white/5 text-[11px] font-mono space-y-1">
                          {Object.entries(log.details.diff).map(([k, change]: [string, any]) => (
                            <div key={k} className="text-slate-300">
                              <span className="text-slate-400">{k}:</span>{' '}
                              <span className="text-red-400 line-through">{String(change.from || 'null')}</span> →{' '}
                              <span className="text-emerald-400 font-bold">{String(change.to)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setHistoryRecordId(null)}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 mt-4"
            >
              Close History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
