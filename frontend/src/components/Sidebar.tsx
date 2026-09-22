import React, { useCallback, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderTree,
  Database,
  Users,
  PlusCircle,
  UserCircle,
  History,
  Zap,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [namespaces, setNamespaces] = useState<any[]>([]);

  const fetchNamespaces = useCallback(async () => {
    try {
      const res = await api.get('/compose/namespaces');
      setNamespaces(res.data);
    } catch (err) {
      console.error('Failed to load namespaces', err);
    }
  }, []);

  // Fetch on mount, route change, custom update event, and window focus
  useEffect(() => {
    fetchNamespaces();

    const handleUpdate = () => {
      fetchNamespaces();
    };

    window.addEventListener('crm:namespaces:updated', handleUpdate);
    window.addEventListener('focus', handleUpdate);

    return () => {
      window.removeEventListener('crm:namespaces:updated', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
    };
  }, [fetchNamespaces, location.pathname]);

  const isAdminOrSuper = user?.role === 'SUPERADMIN' || user?.role === 'ADMIN';

  return (
    <aside className="w-64 bg-slate-900 border-r border-white/10 text-slate-300 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shadow-xl">
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-3 font-mono">
            Platform Menu
          </div>
          <nav className="space-y-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20'
                    : 'hover:bg-white/5 text-slate-300 hover:text-white'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/namespaces"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20'
                    : 'hover:bg-white/5 text-slate-300 hover:text-white'
                }`
              }
            >
              <FolderTree className="w-4 h-4" />
              <span>Namespaces & Apps</span>
            </NavLink>

            <NavLink
              to="/automations"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                    : 'hover:bg-white/5 text-slate-300 hover:text-white'
                }`
              }
            >
              <Zap className="w-4 h-4 text-purple-400" />
              <span>Automations</span>
            </NavLink>

            <NavLink
              to="/audit-logs"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20'
                    : 'hover:bg-white/5 text-slate-300 hover:text-white'
                }`
              }
            >
              <History className="w-4 h-4 text-sky-400" />
              <span>Audit Logs</span>
            </NavLink>

            {isAdminOrSuper && (
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                      : 'hover:bg-white/5 text-slate-300 hover:text-white'
                  }`
                }
              >
                <Users className="w-4 h-4" />
                <span>User Management</span>
              </NavLink>
            )}

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20'
                    : 'hover:bg-white/5 text-slate-300 hover:text-white'
                }`
              }
            >
              <UserCircle className="w-4 h-4" />
              <span>My Profile</span>
            </NavLink>
          </nav>
        </div>

        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-3 font-mono">
            <span>Applications</span>
            <NavLink to="/namespaces" className="hover:text-sky-400 p-0.5">
              <PlusCircle className="w-3.5 h-3.5" />
            </NavLink>
          </div>
          <div className="space-y-1">
            {namespaces.length === 0 ? (
              <p className="text-xs text-slate-500 px-3 italic">No apps created yet</p>
            ) : (
              namespaces.map((ns) => (
                <NavLink
                  key={ns.id}
                  to={`/namespaces/${ns.id}/modules`}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white/10 text-white border border-white/10'
                        : 'hover:bg-white/5 text-slate-400 hover:text-slate-200'
                    }`
                  }
                >
                  <Database className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                  <span className="truncate">{ns.name}</span>
                </NavLink>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10 text-[11px] text-slate-500 text-center font-mono">
        <span>Aura CRM v2.0</span>
      </div>
    </aside>
  );
};
