import React from 'react';
import { Layers, Database, Shield, Zap, Sparkles } from 'lucide-react';

export const AuthShowcase: React.FC = () => {
  return (
    <div className="relative hidden lg:flex flex-col justify-between items-center w-1/2 min-h-full bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white p-12 overflow-hidden select-none">
      {/* Background Animated Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-sky-500/15 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />

      {/* Top subtle brand badge */}
      <div className="relative z-10 w-full flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-semibold text-sky-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Platform</span>
        </div>
        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
          v2.0
        </span>
      </div>

      {/* Centerpiece: 3D Animated Project Emblem & Icon */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center space-y-8 perspective-1000">
        {/* Animated 3D Floating Layers Emblem */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Outer Pulsing Glow Rings */}
          <div className="absolute inset-0 rounded-full border border-sky-500/20 animate-ping opacity-25" />
          <div className="absolute -inset-4 rounded-full border border-dashed border-indigo-500/20 animate-spin [animation-duration:25s]" />
          <div className="absolute -inset-8 rounded-full border border-sky-400/10 animate-spin [animation-duration:35s] [animation-direction:reverse]" />

          {/* Floating Central 3D Layer Stack */}
          <div className="animate-float relative z-10 w-32 h-32 rounded-3xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-sky-400 p-0.5 shadow-2xl shadow-sky-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950/80 rounded-[22px] backdrop-blur-xl flex flex-col items-center justify-center gap-2 border border-white/20">
              <Layers className="w-14 h-14 text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.6)]" />
            </div>
          </div>

          {/* Floating Orbiting Satellite Icons */}
          <div className="animate-float-reverse absolute -top-3 -right-3 w-11 h-11 rounded-2xl bg-slate-900/90 border border-indigo-500/40 backdrop-blur-md shadow-lg flex items-center justify-center text-indigo-400">
            <Database className="w-5 h-5" />
          </div>

          <div className="animate-float absolute -bottom-3 -left-3 w-11 h-11 rounded-2xl bg-slate-900/90 border border-sky-500/40 backdrop-blur-md shadow-lg flex items-center justify-center text-sky-400">
            <Shield className="w-5 h-5" />
          </div>

          <div className="animate-float-reverse absolute -bottom-2 -right-3 w-10 h-10 rounded-2xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-md shadow-lg flex items-center justify-center text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
        </div>

        {/* Project Title & Tagline */}
        <div className="space-y-3 max-w-sm">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Aura{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400">
              CRM
            </span>
          </h1>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">
            Enterprise Low-Code Engine for Dynamic Modules, Automated Workflows & Instant UI.
          </p>
        </div>
      </div>

      {/* Bottom Tech Badges */}
      <div className="relative z-10 w-full pt-6 border-t border-white/10 flex items-center justify-center gap-2">
        <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-sky-300">
          React 18
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-indigo-300">
          TypeScript
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-red-300">
          NestJS 10
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-emerald-300">
          PostgreSQL
        </span>
      </div>
    </div>
  );
};
