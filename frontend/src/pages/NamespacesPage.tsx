import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, FolderTree, ArrowRight, X, AlertCircle } from 'lucide-react';
import api from '../services/api';

export const NamespacesPage: React.FC = () => {
  const [namespaces, setNamespaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchNamespaces = async () => {
    try {
      const res = await api.get('/compose/namespaces');
      setNamespaces(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNamespaces();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!handle) {
      setHandle(val.toLowerCase().replace(/[^a-z0-9]/g, '_'));
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.post('/compose/namespaces', { name, handle, description });
      setShowModal(false);
      setName('');
      setHandle('');
      setDescription('');
      fetchNamespaces();
      window.dispatchEvent(new CustomEvent('crm:namespaces:updated'));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create namespace');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete namespace "${name}" and all its modules/records?`)) return;
    try {
      await api.delete(`/compose/namespaces/${id}`);
      fetchNamespaces();
      window.dispatchEvent(new CustomEvent('crm:namespaces:updated'));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete namespace');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Application Namespaces</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage high-level workspaces and business application suites.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Application</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading namespaces...</div>
      ) : namespaces.length === 0 ? (
        <div className="bg-slate-900/60 border border-dashed border-white/10 rounded-3xl p-12 text-center space-y-3">
          <FolderTree className="w-12 h-12 text-slate-600 mx-auto mb-2" />
          <h3 className="text-base font-bold text-white">No applications created yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Create your first application namespace to start structuring custom CRM modules and records.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Application
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {namespaces.map((ns) => (
            <div
              key={ns.id}
              className="bg-slate-900/90 border border-white/10 hover:border-sky-500/40 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between group backdrop-blur-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
                    {ns.handle}
                  </span>
                  <button
                    onClick={() => handleDelete(ns.id, ns.name)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                    title="Delete namespace"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-base font-bold text-white mb-1 group-hover:text-sky-300 transition-colors">
                  {ns.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">{ns.description || 'No description provided'}</p>
                <div className="text-[11px] text-slate-500 font-mono mt-3">{ns._count?.modules || 0} Modules configured</div>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10">
                <Link
                  to={`/namespaces/${ns.id}/modules`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-white/5 hover:bg-sky-600 text-slate-200 hover:text-white font-semibold rounded-xl text-xs transition-all border border-white/5 hover:border-transparent"
                >
                  <span>Manage Modules</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Create New Application</h3>
                <p className="text-xs text-slate-400">Define an application namespace workspace</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Application Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. Sales CRM"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-white/10 rounded-xl focus:border-sky-500 focus:outline-none text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Handle (System Identifier)</label>
                <input
                  type="text"
                  required
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="sales_crm"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-white/10 rounded-xl font-mono text-xs text-sky-400 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Primary workspace for lead and deal tracking"
                  rows={3}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-white/10 rounded-xl focus:border-sky-500 focus:outline-none text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
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
                  className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Creating...' : 'Create Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
