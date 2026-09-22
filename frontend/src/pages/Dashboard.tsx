import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Database,
  FolderTree,
  FileSpreadsheet,
  Plus,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Activity,
  Zap,
  History,
  Users,
  Layers,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [namespaces, setNamespaces] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [modulesCount, setModulesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [nsRes, auditRes] = await Promise.all([
          api.get('/compose/namespaces'),
          api.get('/audit?limit=6').catch(() => ({ data: [] })),
        ]);
        setNamespaces(nsRes.data);
        setRecentLogs(auditRes.data);

        // Calculate total modules
        let totalMods = 0;
        for (const ns of nsRes.data) {
          const modRes = await api.get(`/compose/namespaces/${ns.id}/modules`).catch(() => ({ data: [] }));
          totalMods += modRes.data.length;
        }
        setModulesCount(totalMods);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Mock analytics curve points for SVG render
  const chartData = [
    { day: 'Mon', count: 12 },
    { day: 'Tue', count: 19 },
    { day: 'Wed', count: 15 },
    { day: 'Thu', count: 28 },
    { day: 'Fri', count: 32 },
    { day: 'Sat', count: 24 },
    { day: 'Sun', count: 38 },
  ];

  const maxVal = Math.max(...chartData.map((d) => d.count), 40);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-slate-900 p-8 text-white shadow-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>Aura Intelligence Engine Active</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-sky-100/80 text-sm max-w-xl leading-relaxed">
            Monitor real-time CRM performance, build automated workflows, inspect audit trails, and manage schema modules.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Link
            to="/namespaces"
            className="inline-flex items-center gap-2 px-5 py-3 bg-white text-slate-900 hover:bg-sky-50 font-bold rounded-xl shadow-lg transition-all text-sm cursor-pointer hover:scale-105"
          >
            <Plus className="w-4 h-4 text-sky-600" />
            <span>New App</span>
          </Link>
          <Link
            to="/automations"
            className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl backdrop-blur-md transition-all text-sm"
          >
            <Zap className="w-4 h-4 text-purple-300" />
            <span>Automations</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between group hover:border-sky-500/40 transition-all">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Applications</div>
            <div className="text-2xl font-black text-white mt-1">{namespaces.length}</div>
            <div className="text-[11px] text-sky-400 mt-0.5 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3 h-3" />
              <span>Active Namespaces</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-500/15 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FolderTree className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between group hover:border-emerald-500/40 transition-all">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Data Modules</div>
            <div className="text-2xl font-black text-white mt-1">{modulesCount}</div>
            <div className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1 font-mono">
              <Database className="w-3 h-3" />
              <span>Dynamic Tables</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between group hover:border-purple-500/40 transition-all">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Audit Events</div>
            <div className="text-2xl font-black text-white mt-1">{recentLogs.length > 0 ? 'Live' : '0'}</div>
            <div className="text-[11px] text-purple-400 mt-0.5 flex items-center gap-1 font-mono">
              <History className="w-3 h-3" />
              <span>Real-Time Logs</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between group hover:border-indigo-500/40 transition-all">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">RBAC Security</div>
            <div className="text-xl font-black text-white mt-1">{user?.role}</div>
            <div className="text-[11px] text-indigo-400 mt-0.5 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Session</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Trend Chart */}
        <div className="lg:col-span-2 rounded-3xl bg-slate-900/90 border border-white/10 p-6 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Record Creation & Velocity</h3>
                <p className="text-xs text-slate-400">Weekly CRM record volume & automation throughput</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
              +38% vs Last Week
            </span>
          </div>

          {/* SVG Bar & Sparkline Chart */}
          <div className="space-y-2">
            <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
              {chartData.map((d, i) => {
                const heightPercent = (d.count / maxVal) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-bold text-sky-400">
                      {d.count}
                    </div>
                    <div
                      className="w-full rounded-t-xl bg-gradient-to-t from-indigo-600 via-sky-500 to-sky-400 group-hover:from-indigo-500 group-hover:to-emerald-400 transition-all shadow-md group-hover:shadow-sky-500/30"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[10px] text-slate-400 font-mono group-hover:text-white">
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Powered by Type-Safe JSONB Schema Storage</span>
            <Link to="/audit-logs" className="text-sky-400 hover:underline flex items-center gap-1">
              View Detailed Analytics <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Real-Time Live Activity Feed */}
        <div className="rounded-3xl bg-slate-900/90 border border-white/10 p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white">Live Activity Feed</h3>
            </div>
            <Link to="/audit-logs" className="text-xs text-slate-400 hover:text-white">
              All Logs
            </Link>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-60 pr-1">
            {recentLogs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No recent actions recorded yet.
              </div>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200 truncate max-w-[120px]">
                      {log.userName}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <span className="text-sky-400 font-medium font-mono">{log.action}</span> on{' '}
                    <span className="text-slate-300">{log.entityType}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <Link
            to="/automations"
            className="w-full py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span>Manage Automated Rules</span>
          </Link>
        </div>
      </div>

      {/* Applications Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Applications & Namespaces</h2>
            <p className="text-xs text-slate-400">Open an application to view modules, data grids, and forms</p>
          </div>
          <Link to="/namespaces" className="text-xs font-semibold text-sky-400 hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading namespaces...</div>
        ) : namespaces.length === 0 ? (
          <div className="rounded-3xl bg-slate-900/60 border border-dashed border-white/10 p-12 text-center space-y-3">
            <FolderTree className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No applications created yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Get started by creating your first CRM application namespace (e.g., "Sales CRM", "HR Hub").
            </p>
            <Link
              to="/namespaces"
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-xl text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create CRM Namespace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {namespaces.map((ns) => (
              <div
                key={ns.id}
                className="rounded-2xl bg-slate-900/80 border border-white/10 hover:border-sky-500/40 p-6 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-sky-400 border border-white/10">
                      {ns.handle}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{ns._count?.modules || 0} Modules</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-sky-300 transition-colors">
                    {ns.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{ns.description || 'No description provided'}</p>
                </div>

                <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-between">
                  <Link
                    to={`/namespaces/${ns.id}/modules`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300"
                  >
                    Open Application <ArrowRight className="w-3.5 h-3.5" />
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
