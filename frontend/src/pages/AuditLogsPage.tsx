import React, { useEffect, useState } from 'react';
import {
  History,
  Shield,
  Search,
  Filter,
  RefreshCw,
  Clock,
  User,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Zap,
  Layers,
  FolderTree,
  FileText,
  Upload,
  UserCheck,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';
import api from '../services/api';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const url = filterType ? `/audit?entityType=${filterType}` : '/audit';
      const res = await api.get(url);
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filterType]);

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const detailsStr = JSON.stringify(log.details || '').toLowerCase();
    return (
      log.userName?.toLowerCase().includes(q) ||
      log.userEmail?.toLowerCase().includes(q) ||
      log.action?.toLowerCase().includes(q) ||
      log.entityType?.toLowerCase().includes(q) ||
      detailsStr.includes(q)
    );
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'CREATE_MODULE':
        return { label: '+ Created Module', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
      case 'DELETE_MODULE':
        return { label: '🗑 Deleted Module', color: 'bg-red-500/15 text-red-400 border-red-500/30' };
      case 'CREATE_NAMESPACE':
        return { label: '+ Created Application', color: 'bg-sky-500/15 text-sky-400 border-sky-500/30' };
      case 'DELETE_NAMESPACE':
        return { label: '🗑 Deleted Application', color: 'bg-red-500/15 text-red-400 border-red-500/30' };
      case 'CREATE_FIELD':
        return { label: '+ Added Field', color: 'bg-teal-500/15 text-teal-400 border-teal-500/30' };
      case 'DELETE_FIELD':
        return { label: '🗑 Deleted Field', color: 'bg-red-500/15 text-red-400 border-red-500/30' };
      case 'CREATE_RECORD':
        return { label: '+ Created Record', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
      case 'UPDATE_RECORD':
        return { label: '✎ Updated Record', color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' };
      case 'DELETE_RECORD':
        return { label: '🗑 Deleted Record', color: 'bg-red-500/15 text-red-400 border-red-500/30' };
      case 'BULK_IMPORT_CSV':
        return { label: '📥 CSV Imported', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' };
      case 'UPDATE_ROLE':
        return { label: '🛡 Role Changed', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' };
      case 'ACTIVATE_USER':
        return { label: '✓ User Activated', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
      case 'DEACTIVATE_USER':
        return { label: '✕ User Deactivated', color: 'bg-red-500/15 text-red-400 border-red-500/30' };
      case 'AUTOMATION_TRIGGERED':
        return { label: '⚡ Automation Triggered', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' };
      default:
        return { label: action, color: 'bg-white/10 text-slate-300 border-white/15' };
    }
  };

  const renderLogDescription = (log: any) => {
    const details = log.details || {};

    switch (log.action) {
      case 'CREATE_MODULE':
        return (
          <span>
            Created new module <strong className="text-white font-semibold">"{details.moduleName || 'Module'}"</strong> in application{' '}
            <strong className="text-sky-400 font-semibold">{details.namespaceName || 'Application'}</strong>
          </span>
        );
      case 'DELETE_MODULE':
        return (
          <span>
            Deleted module <strong className="text-red-400 font-semibold">"{details.moduleName || 'Module'}"</strong>
          </span>
        );
      case 'CREATE_NAMESPACE':
        return (
          <span>
            Created new application workspace <strong className="text-white font-semibold">"{details.name || 'Application'}"</strong> ({details.handle})
          </span>
        );
      case 'DELETE_NAMESPACE':
        return (
          <span>
            Deleted application workspace <strong className="text-red-400 font-semibold">"{details.name || 'Application'}"</strong>
          </span>
        );
      case 'CREATE_FIELD':
        return (
          <span>
            Added column field <strong className="text-white font-semibold">"{details.fieldLabel}"</strong> ({details.kind}) to module{' '}
            <strong className="text-sky-400 font-semibold">"{details.moduleName}"</strong>
          </span>
        );
      case 'DELETE_FIELD':
        return (
          <span>
            Removed field <strong className="text-red-400 font-semibold">"{details.fieldLabel}"</strong> from module{' '}
            <strong className="text-slate-300 font-semibold">"{details.moduleName}"</strong>
          </span>
        );
      case 'CREATE_RECORD':
        return (
          <span>
            Created a new data record in module <strong className="text-sky-400 font-semibold">"{details.moduleName || 'Module'}"</strong>
          </span>
        );
      case 'UPDATE_RECORD':
        const diffCount = Object.keys(details.diff || {}).length;
        return (
          <span>
            Updated record in module <strong className="text-sky-400 font-semibold">"{details.moduleName || 'Module'}"</strong>{' '}
            <span className="text-slate-400">({diffCount} field{diffCount === 1 ? '' : 's'} modified)</span>
          </span>
        );
      case 'DELETE_RECORD':
        return (
          <span>
            Deleted record from module <strong className="text-slate-300 font-semibold">"{details.moduleName || 'Module'}"</strong>
          </span>
        );
      case 'BULK_IMPORT_CSV':
        return (
          <span>
            Bulk imported <strong className="text-emerald-400 font-semibold">{details.importedCount}</strong> records into module{' '}
            <strong className="text-sky-400 font-semibold">"{details.moduleName}"</strong> via CSV
          </span>
        );
      case 'UPDATE_ROLE':
        return (
          <span>
            Changed role for user <strong className="text-white font-semibold">{details.targetUserEmail}</strong> from{' '}
            <span className="text-slate-400 font-mono">{details.oldRole}</span> →{' '}
            <strong className="text-purple-400 font-mono">{details.newRole}</strong>
          </span>
        );
      case 'ACTIVATE_USER':
        return (
          <span>
            Activated user account for <strong className="text-white font-semibold">{details.targetUserEmail}</strong>
          </span>
        );
      case 'DEACTIVATE_USER':
        return (
          <span>
            Deactivated user account for <strong className="text-red-400 font-semibold">{details.targetUserEmail}</strong>
          </span>
        );
      case 'AUTOMATION_TRIGGERED':
        return (
          <span>
            Executed automation rule <strong className="text-purple-400 font-semibold">"{details.ruleName}"</strong>
          </span>
        );
      default:
        return (
          <span>
            Performed <strong className="text-white">{log.action}</strong> on <span className="text-sky-400 font-mono">{log.entityType}</span>
          </span>
        );
    }
  };

  const getTargetPill = (log: any) => {
    const details = log.details || {};
    if (details.moduleName) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
          <Layers className="w-3 h-3 text-sky-400" />
          {details.moduleName}
        </span>
      );
    }
    if (details.name && log.entityType === 'NAMESPACE') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          <FolderTree className="w-3 h-3 text-indigo-400" />
          {details.name}
        </span>
      );
    }
    if (details.targetUserEmail) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
          <User className="w-3 h-3 text-purple-400" />
          {details.targetUserEmail}
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
        {log.entityType}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Audit Logs & Activity History</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 text-xs font-mono border border-sky-500/20 font-bold">
              Real-Time
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Detailed chronological record of all user creations, updates, field modifications, and automated executions
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user, action, module name, or changes..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full pl-10 pr-8 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-sky-500 appearance-none"
          >
            <option value="">All Entity Types</option>
            <option value="MODULE">Modules</option>
            <option value="NAMESPACE">Applications (Namespaces)</option>
            <option value="FIELD">Fields & Columns</option>
            <option value="RECORD">Records</option>
            <option value="AUTOMATION">Automations</option>
            <option value="USER">User & RBAC</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-white/10 shadow-xl overflow-hidden backdrop-blur-md">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading audit history...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <History className="w-8 h-8 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-white">No audit logs found</div>
            <p className="text-xs text-slate-500">Actions taken by team members will automatically appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              const badge = getActionBadge(log.action);

              return (
                <div key={log.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                        title="Click to view full change payload"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-sky-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>

                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-md shadow-sky-500/20">
                        {log.userName?.[0]?.toUpperCase() || 'U'}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white">{log.userName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({log.userEmail})</span>
                        </div>
                        <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                          {renderLogDescription(log)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end lg:self-center flex-wrap">
                      {getTargetPill(log)}

                      <span
                        className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${badge.color}`}
                      >
                        {badge.label}
                      </span>

                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail View */}
                  {isExpanded && log.details && (
                    <div className="mt-3 ml-11 p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 text-xs font-mono overflow-x-auto space-y-2">
                      <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5 font-mono">
                        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                        <span>Exact Payload & Changes Recorded:</span>
                      </div>

                      {log.details.diff ? (
                        <div className="space-y-1 text-xs">
                          {Object.entries(log.details.diff).map(([k, change]: [string, any]) => (
                            <div key={k} className="p-1.5 rounded bg-white/5 flex items-center gap-2 flex-wrap">
                              <span className="text-slate-400 font-semibold">{k}:</span>
                              <span className="text-red-400 line-through bg-red-500/10 px-1.5 py-0.5 rounded">
                                {String(change.from || 'null')}
                              </span>
                              <span className="text-slate-500">→</span>
                              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                {String(change.to)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <pre className="text-slate-300 text-[11px] leading-relaxed">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
