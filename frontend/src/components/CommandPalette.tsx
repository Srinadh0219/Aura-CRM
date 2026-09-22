import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  FolderTree,
  Database,
  Users,
  UserCircle,
  FileText,
  Zap,
  History,
  X,
  ArrowRight,
} from 'lucide-react';
import api from '../services/api';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [namespaces, setNamespaces] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      api.get('/compose/namespaces').then((res) => setNamespaces(res.data)).catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const defaultNavigation = [
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Pages' },
    { title: 'Namespaces & Applications', path: '/namespaces', icon: FolderTree, category: 'Pages' },
    { title: 'Audit Logs & Activity History', path: '/audit-logs', icon: History, category: 'Pages' },
    { title: 'Automations & Workflow Triggers', path: '/automations', icon: Zap, category: 'Pages' },
    { title: 'User Management (RBAC)', path: '/users', icon: Users, category: 'Pages' },
    { title: 'My Profile & Account Settings', path: '/profile', icon: UserCircle, category: 'Pages' },
  ];

  const appItems = namespaces.map((ns) => ({
    title: `${ns.name} (App)`,
    path: `/namespaces/${ns.id}/modules`,
    icon: Database,
    category: 'Applications',
  }));

  const allItems = [...defaultNavigation, ...appItems];
  const filteredItems = query
    ? allItems.filter((i) => i.title.toLowerCase().includes(query.toLowerCase()))
    : allItems;

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-sky-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, page, or application name..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching pages or applications found for "{query}"
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.path)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm text-slate-200 hover:bg-sky-600 hover:text-white transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover:border-transparent group-hover:bg-white/20">
                      <Icon className="w-4 h-4 text-sky-400 group-hover:text-white" />
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 group-hover:text-white">
                      {item.category}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Navigate with arrows or mouse</span>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-slate-300">ESC</kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
