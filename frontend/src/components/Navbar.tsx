import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Shield, Layers, Search, Command } from 'lucide-react';

interface NavbarProps {
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-slate-900/90 border-b border-white/10 h-16 flex items-center justify-between px-6 sticky top-0 z-30 shadow-md backdrop-blur-md">
      {/* Brand Logo */}
      <Link to="/dashboard" className="flex items-center gap-3 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <div className="font-extrabold text-white text-base leading-tight group-hover:text-sky-300 transition-colors flex items-center gap-1.5">
            Aura CRM
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
              v2.0
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block -mt-0.5">Enterprise Low-Code Engine</span>
        </div>
      </Link>

      {/* Center Search / Command Palette Bar */}
      <button
        onClick={onOpenCommandPalette}
        className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-white/10 hover:border-white/20 text-slate-400 hover:text-slate-200 text-xs transition-all w-72 justify-between cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-sky-400" />
          <span>Quick search or jump to...</span>
        </div>
        <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] font-mono text-slate-300">
          Ctrl K
        </kbd>
      </button>

      {/* Right User Actions */}
      <div className="flex items-center gap-3">
        {user && (
          <>
            <Link
              to="/profile"
              title="Click to view and edit your profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 transition-all border border-white/10 shadow-sm cursor-pointer group"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                {user.firstName?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="group-hover:text-white">{user.firstName} {user.lastName}</span>
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-sky-500/10 text-sky-400 font-mono font-bold flex items-center gap-1 border border-sky-500/20">
                <Shield className="w-2.5 h-2.5" />
                {user.role}
              </span>
            </Link>

            <button
              onClick={logout}
              title="Sign out"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl border border-transparent hover:border-red-500/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};
