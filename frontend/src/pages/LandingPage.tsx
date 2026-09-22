import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Layers,
  Database,
  Shield,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  UserCheck,
  Eye,
  Github,
  Linkedin,
  Mail,
  Table,
  Sliders,
  Cpu,
  Boxes,
  LayoutDashboard,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white relative overflow-hidden">
      {/* Background Animated Glow Blobs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sky-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-30 border-b border-white/10 backdrop-blur-md bg-slate-950/60 sticky top-0 px-6 lg:px-12 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-sky-400 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
              Aura CRM
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                v2.0
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block -mt-0.5">Enterprise Low-Code Engine</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#roles" className="hover:text-white transition-colors">
            Role Architecture
          </a>
          <a href="#tech-stack" className="hover:text-white transition-colors">
            Tech Stack
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-sky-500/20 transition-all hover:scale-[1.02]"
          >
            <span>Register</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-20 px-6 lg:px-12 pt-16 pb-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Left Hero Text */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-semibold text-sky-400 shadow-inner">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Modern Low-Code Application & CRM Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
            Build custom CRMs <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400">
              at lightning speed.
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Create custom data models, dynamic form controls, and automated business workflows visually without writing SQL or boilerplate code.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              to={user ? '/dashboard' : '/register'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-sky-500/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Launch Aura Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#roles"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold text-sm backdrop-blur-md transition-all"
            >
              <span>Explore Roles & Permissions</span>
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="pt-8 grid grid-cols-3 gap-6 border-t border-white/10 max-w-md mx-auto lg:mx-0">
            <div>
              <div className="text-2xl font-black text-white">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">Dynamic Schemas</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">4 Tiers</div>
              <div className="text-xs text-slate-400 mt-0.5">Granular RBAC</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">Zero SQL</div>
              <div className="text-xs text-slate-400 mt-0.5">Auto UI Generation</div>
            </div>
          </div>
        </div>

        {/* Right 3D Visual Floating Mockup */}
        <div className="flex-1 relative perspective-1000 w-full max-w-lg lg:max-w-none">
          {/* Main 3D Card */}
          <div className="animate-float relative rounded-3xl bg-slate-900/80 border border-white/15 p-6 shadow-2xl shadow-sky-500/10 backdrop-blur-xl">
            {/* Header simulated bar */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400">Sales CRM • Pipeline</span>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Engine
              </span>
            </div>

            {/* Simulated Live Modules Grid */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
                    LD
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-100">Leads Module</div>
                    <div className="text-[11px] text-slate-400">12 Active Fields • Auto Form Generated</div>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-sky-500/20 text-sky-300">
                  48 Records
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                    DL
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-100">Deals & Opportunities</div>
                    <div className="text-[11px] text-slate-400">Currency, Stage Dropdowns, Win Probabilities</div>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-indigo-500/20 text-indigo-300">
                  $480k Pipeline
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    CT
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-100">Contacts & Accounts</div>
                    <div className="text-[11px] text-slate-400">Linked Relationships & Activity Timelines</div>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-500/20 text-emerald-300">
                  124 Verified
                </span>
              </div>
            </div>

            {/* Simulated Live Form Action */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-slate-400">Schema Engine: Type-Safe JSONB</span>
              <span className="text-sky-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized
              </span>
            </div>
          </div>

          {/* Floating Satellite Badge 1 */}
          <div className="animate-float-reverse absolute -bottom-6 -left-6 p-4 rounded-2xl bg-slate-900/90 border border-sky-500/30 backdrop-blur-xl shadow-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Strict RBAC Security</div>
              <div className="text-[10px] text-slate-400">Role-level guard protections</div>
            </div>
          </div>

          {/* Floating Satellite Badge 2 */}
          <div className="animate-float absolute -top-6 -right-6 p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 backdrop-blur-xl shadow-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Dynamic Form Builder</div>
              <div className="text-[10px] text-slate-400">Zero backend changes needed</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: 4 Role Breakdown Boxes */}
      <section id="roles" className="relative z-20 px-6 lg:px-12 py-20 bg-slate-900/60 border-y border-white/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Role-Based Access Control (RBAC)</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              What Each Role Does in Aura CRM
            </h2>
            <p className="text-sm text-slate-400">
              Every action in the system is governed by strict authorization tiers, ensuring complete data security and control.
            </p>
          </div>

          {/* 4 Role Boxes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Box 1: SUPERADMIN */}
            <div className="rounded-3xl bg-slate-950/80 border border-purple-500/30 hover:border-purple-500/60 p-6 shadow-xl hover:shadow-purple-500/10 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Tier 1 • Owner
                </span>
                <h3 className="text-xl font-bold text-white mt-3 mb-2">Superadmin</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Complete authority over the entire platform, accounts, configurations, and core database.
                </p>

                <div className="space-y-2.5 border-t border-white/10 pt-4 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Promote or demote any user role</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Activate or deactivate user accounts</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Delete applications & namespaces</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Full master access to all records</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-purple-300/80 font-mono">
                Access Level: Full Master Authority
              </div>
            </div>

            {/* Box 2: ADMIN */}
            <div className="rounded-3xl bg-slate-950/80 border border-indigo-500/30 hover:border-indigo-500/60 p-6 shadow-xl hover:shadow-indigo-500/10 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sliders className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Tier 2 • Architect
                </span>
                <h3 className="text-xl font-bold text-white mt-3 mb-2">Admin</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Designs applications, manages schemas, adds modules, and customizes CRM data structures.
                </p>

                <div className="space-y-2.5 border-t border-white/10 pt-4 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>Create & manage Applications</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>Create CRM Modules (Leads, Deals)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>Add & configure custom fields</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>View all team member directories</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-indigo-300/80 font-mono">
                Access Level: Schema & App Management
              </div>
            </div>

            {/* Box 3: MEMBER */}
            <div className="rounded-3xl bg-slate-950/80 border border-sky-500/30 hover:border-sky-500/60 p-6 shadow-xl hover:shadow-sky-500/10 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Tier 3 • Operator
                </span>
                <h3 className="text-xl font-bold text-white mt-3 mb-2">Member</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Standard team member creating records, managing leads, tracking pipeline, and editing data.
                </p>

                <div className="space-y-2.5 border-t border-white/10 pt-4 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                    <span>Create new CRM records & entries</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                    <span>Update and edit assigned records</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                    <span>Search and filter across modules</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                    <span>Manage personal profile & password</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-sky-300/80 font-mono">
                Access Level: Read & Write Records
              </div>
            </div>

            {/* Box 4: VIEWER */}
            <div className="rounded-3xl bg-slate-950/80 border border-emerald-500/30 hover:border-emerald-500/60 p-6 shadow-xl hover:shadow-emerald-500/10 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Eye className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Tier 4 • Read-Only
                </span>
                <h3 className="text-xl font-bold text-white mt-3 mb-2">Viewer</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Auditor / Stakeholder tier with read-only access for inspections, reports, and dashboards.
                </p>

                <div className="space-y-2.5 border-t border-white/10 pt-4 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Browse and search data records</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>View analytics & module layouts</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Zero record edit / delete permissions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Safe auditing & compliance viewing</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-emerald-300/80 font-mono">
                Access Level: Strict Read-Only
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Core Features */}
      <section id="features" className="relative z-20 px-6 lg:px-12 py-20 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-semibold text-sky-400">
            <Zap className="w-3.5 h-3.5" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Engineered for Flexibility & Scale
          </h2>
          <p className="text-sm text-slate-400">
            Everything you need to run business CRM operations with full customization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-sky-500/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/15 text-sky-400 flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Dynamic Field Modeler</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Define string, numeric values, dropdown select arrays, datetime timestamps, and relationships on any module dynamically.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-indigo-500/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <Table className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Auto-Rendered Data Grids</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tables automatically generate columns, pagination controls, search indexes, and modal forms without writing frontend code.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-emerald-500/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">API-First Architecture</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every namespace, module, and record has a fully documented REST API with Swagger OpenAPI explorer built into the backend.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: Tech Stack */}
      <section id="tech-stack" className="relative z-20 px-6 lg:px-12 py-16 bg-slate-900/40 border-t border-white/10 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Built with Modern Industry Standard Tech Stack
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="px-4 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-sky-400 font-bold">
              React 18 + Vite
            </span>
            <span className="px-4 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-indigo-400 font-bold">
              TypeScript
            </span>
            <span className="px-4 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-red-400 font-bold">
              NestJS 10 Framework
            </span>
            <span className="px-4 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-emerald-400 font-bold">
              Prisma ORM
            </span>
            <span className="px-4 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-sky-300 font-bold">
              Tailwind CSS
            </span>
            <span className="px-4 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-emerald-400 font-bold">
              PostgreSQL Database
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 border-t border-white/10 bg-slate-950 px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">Aura CRM</span>
              <span className="text-xs text-slate-500 block">Enterprise Low-Code Engine</span>
            </div>
          </div>

          <div className="text-center space-y-1.5 flex flex-col items-center">
            <div className="text-xs text-slate-500">
              © {new Date().getFullYear()} Aura CRM. All rights reserved.
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400 uppercase">
              SRINADH THATIKRINDHI
            </div>
          </div>

          {/* Social & Contact Accounts (LinkedIn, GitHub, Email) */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://github.com/Srinadh0219"
              target="_blank"
              rel="noopener noreferrer"
              title="Srinadh's GitHub Profile"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all hover:scale-105 shadow-sm flex items-center gap-2 text-xs font-semibold cursor-pointer"
            >
              <Github className="w-4 h-4 text-white" />
              <span>GitHub</span>
            </a>

            <a
              href="https://www.linkedin.com/in/srinadh-thatikrindhi-b0b844323/"
              target="_blank"
              rel="noopener noreferrer"
              title="Srinadh's LinkedIn Profile"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-sky-500/10 border border-white/10 hover:border-sky-500/30 text-slate-300 hover:text-sky-400 transition-all hover:scale-105 shadow-sm flex items-center gap-2 text-xs font-semibold cursor-pointer"
            >
              <Linkedin className="w-4 h-4 text-sky-400" />
              <span>LinkedIn</span>
            </a>

            <a
              href="mailto:srinadhthatikrindhi@gmail.com"
              title="Send Email to Srinadh"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-400 transition-all hover:scale-105 shadow-sm flex items-center gap-2 text-xs font-semibold cursor-pointer"
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
