import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Database, FolderTree, FileSpreadsheet, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [namespaces, setNamespaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get('/compose/namespaces');
        setNamespaces(res.data);
      } catch (err) {
        console.error('Error fetching namespaces', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold uppercase tracking-wider">
            Enterprise Workspace
          </span>
          <h1 className="text-3xl font-bold mt-2">Welcome back, {user?.firstName}!</h1>
          <p className="text-sky-100 text-sm mt-1 max-w-xl">
            Build CRM modules, customize dynamic fields, manage records, and structure your business data visually.
          </p>
        </div>
        <Link
          to="/namespaces"
          className="inline-flex items-center gap-2 px-5 py-3 bg-white text-sky-700 hover:bg-sky-50 font-semibold rounded-xl shadow-md transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Create Application
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <FolderTree className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{namespaces.length}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Namespaces</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">
              {namespaces.reduce((acc, ns) => acc + (ns._count?.modules || 0), 0)}
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Custom Modules</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{user?.role}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Current RBAC Role</div>
          </div>
        </div>
      </div>

      {/* Namespaces Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Applications & Namespaces</h2>
          <Link to="/namespaces" className="text-sm font-semibold text-sky-600 hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading namespaces...</div>
        ) : namespaces.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
            <FolderTree className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No applications created yet</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mt-1 mb-4">
              Get started by creating your first CRM application namespace (e.g., "Sales CRM").
            </p>
            <Link
              to="/namespaces"
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-xl text-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Create CRM Namespace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {namespaces.map((ns) => (
              <div
                key={ns.id}
                className="bg-white border border-slate-200 hover:border-sky-300 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {ns.handle}
                    </span>
                    <span className="text-xs text-slate-400">{ns._count?.modules || 0} Modules</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{ns.name}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{ns.description || 'No description provided'}</p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/namespaces/${ns.id}/modules`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 hover:text-sky-700"
                  >
                    Open Application <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
