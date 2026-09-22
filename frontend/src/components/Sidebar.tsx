import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderTree, Database, Users, PlusCircle, UserCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const [namespaces, setNamespaces] = useState<any[]>([]);

  useEffect(() => {
    const fetchNamespaces = async () => {
      try {
        const res = await api.get('/compose/namespaces');
        setNamespaces(res.data);
      } catch (err) {
        console.error('Failed to load namespaces', err);
      }
    };
    fetchNamespaces();
  }, []);

  const isAdminOrSuper = user?.role === 'SUPERADMIN' || user?.role === 'ADMIN';

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4">
      <div className="space-y-6">
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
            Core Menu
          </div>
          <nav className="space-y-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-sky-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </NavLink>
            <NavLink
              to="/namespaces"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-sky-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                }`
              }
            >
              <FolderTree className="w-4 h-4" />
              Namespaces & Apps
            </NavLink>

            {isAdminOrSuper && (
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                  }`
                }
              >
                <Users className="w-4 h-4" />
                User Management
              </NavLink>
            )}

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-sky-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                }`
              }
            >
              <UserCircle className="w-4 h-4" />
              My Profile
            </NavLink>
          </nav>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
            <span>Applications</span>
            <NavLink to="/namespaces" className="hover:text-sky-400">
              <PlusCircle className="w-4 h-4" />
            </NavLink>
          </div>
          <div className="space-y-1">
            {namespaces.length === 0 ? (
              <p className="text-xs text-slate-500 px-3 italic">No namespaces created yet</p>
            ) : (
              namespaces.map((ns) => (
                <NavLink
                  key={ns.id}
                  to={`/namespaces/${ns.id}/modules`}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-sky-700/60 text-white' : 'hover:bg-slate-800 text-slate-300'
                    }`
                  }
                >
                  <Database className="w-4 h-4 text-sky-400" />
                  <span className="truncate">{ns.name}</span>
                </NavLink>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        <span>NestJS • React • PostgreSQL</span>
      </div>
    </aside>
  );
};
