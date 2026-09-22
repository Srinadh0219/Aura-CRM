import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, FolderTree, ArrowRight, X } from 'lucide-react';
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
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Application Namespaces</h1>
          <p className="text-sm text-slate-500">Manage high-level workspaces and business application suites.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-sm shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Application
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400">Loading...</div>
      ) : namespaces.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
          <FolderTree className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No applications created</h3>
          <p className="text-sm text-slate-400 mt-1 mb-4">Create your first application to start adding CRM modules.</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-sky-600 text-white font-medium rounded-xl text-sm"
          >
            Create Application
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {namespaces.map((ns) => (
            <div
              key={ns.id}
              className="bg-white border border-slate-200 hover:border-sky-300 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {ns.handle}
                  </span>
                  <button
                    onClick={() => handleDelete(ns.id, ns.name)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                    title="Delete namespace"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{ns.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">{ns.description || 'No description'}</p>
                <div className="text-xs text-slate-400 mt-3">{ns._count?.modules || 0} Modules configured</div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <Link
                  to={`/namespaces/${ns.id}/modules`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-slate-50 hover:bg-sky-50 text-sky-700 font-semibold rounded-xl text-sm transition-colors"
                >
                  Manage Modules <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Create New Application</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Application Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Sales CRM"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Handle (Identifier)</label>
                <input
                  type="text"
                  required
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="sales_crm"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Primary workspace for lead and deal tracking"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold shadow disabled:opacity-50"
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
