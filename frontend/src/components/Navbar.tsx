import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Shield, Layers } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30 shadow-xs">
      <Link to="/dashboard" className="flex items-center gap-3 group">
        <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-sky-700 transition-colors">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-semibold text-slate-800 text-lg leading-tight group-hover:text-sky-600 transition-colors">
            Aura CRM
          </h1>
          <span className="text-xs text-slate-400">Enterprise Low-Code Platform</span>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <Link
              to="/profile"
              title="Click to view and edit your profile"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700 transition-all border border-slate-200/60 shadow-xs cursor-pointer group"
            >
              <UserIcon className="w-4 h-4 text-slate-500 group-hover:text-sky-600" />
              <span className="group-hover:text-slate-900">{user.firstName} {user.lastName}</span>
              <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-sky-100 text-sky-700 font-semibold flex items-center gap-1 group-hover:bg-sky-200">
                <Shield className="w-3 h-3" />
                {user.role}
              </span>
            </Link>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};
