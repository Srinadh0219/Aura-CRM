import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Fingerprint,
  Key,
  ShieldCheck,
  Binary,
  Activity,
  Sparkles,
} from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.accessToken, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-6 relative overflow-hidden selection:bg-cyan-500 selection:text-white">
      {/* Ambient background glow */}
      <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Link */}
      <div className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Centered Content: Symmetrical 3D Biometric Vault Box + Login Box */}
      <div className="relative z-10 my-auto max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Left Side: Completely Distinct 3D Holographic Vault & Biometric Scanner Core */}
        <div className="hidden md:flex flex-col justify-between items-center text-center p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
          {/* Ambient inner gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-indigo-500/10 pointer-events-none" />

          {/* Top Telemetry Badge */}
          <div className="relative z-10 w-full flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-semibold text-cyan-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              AUTH_VAULT // 01
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              AES-256 GCM
            </span>
          </div>

          {/* Center 3D Holographic Biometric Vault Visual */}
          <div className="relative my-auto py-6 flex flex-col items-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Sci-Fi HUD Corner Brackets */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60" />

              {/* Conic Radar Scanner Sweep */}
              <div
                className="absolute inset-2 rounded-full opacity-30 animate-spin [animation-duration:8s] pointer-events-none"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(6, 182, 212, 0.4) 360deg)',
                }}
              />

              {/* Outer Circular Ring with tick marks */}
              <div className="absolute inset-3 rounded-full border border-cyan-500/20" />
              <div className="absolute inset-5 rounded-full border border-dashed border-indigo-400/30 animate-spin [animation-duration:35s] [animation-direction:reverse]" />

              {/* 3D Tilted Diamond Holographic Prism */}
              <div className="animate-float relative z-10 w-24 h-24 rounded-2xl rotate-45 bg-gradient-to-tr from-cyan-500 via-indigo-600 to-emerald-400 p-[2px] shadow-2xl shadow-cyan-500/30 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="w-full h-full bg-slate-950/90 rounded-[14px] backdrop-blur-xl flex items-center justify-center relative overflow-hidden">
                  {/* Glowing Laser Scan Bar */}
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#22d3ee] animate-scan-line z-20 pointer-events-none" />

                  {/* Biometric Fingerprint / Key Matrix */}
                  <div className="-rotate-45 relative z-10 flex items-center justify-center">
                    <Fingerprint className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_14px_rgba(34,211,238,0.9)]" />
                  </div>
                </div>
              </div>

              {/* Floating Hologram Nodes */}
              <div className="animate-float-reverse absolute -top-1 -right-1 w-8 h-8 rounded-xl bg-slate-900/90 border border-cyan-500/40 shadow-md flex items-center justify-center text-cyan-400">
                <Key className="w-3.5 h-3.5" />
              </div>
              <div className="animate-float absolute -bottom-1 -left-1 w-8 h-8 rounded-xl bg-slate-900/90 border border-emerald-500/40 shadow-md flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="animate-float-reverse absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-slate-900/90 border border-indigo-500/40 shadow-md flex items-center justify-center text-indigo-400">
                <Binary className="w-3.5 h-3.5" />
              </div>
              <div className="animate-float absolute -top-1 -left-1 w-8 h-8 rounded-xl bg-slate-900/90 border border-purple-500/40 shadow-md flex items-center justify-center text-purple-400">
                <Activity className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-4 space-y-1.5">
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Aura{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                  Security Hub
                </span>
              </h3>
              <p className="text-xs text-slate-400 max-w-[230px]">
                Zero-Trust authentication portal with encrypted session tokens & role policies.
              </p>
            </div>
          </div>

          {/* Bottom Tech Pills */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-1.5 pt-4 border-t border-white/10 w-full">
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-cyan-300">
              JWT Tokens
            </span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-emerald-300">
              RBAC Guard
            </span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-indigo-300">
              NestJS
            </span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-sky-300">
              PostgreSQL
            </span>
          </div>
        </div>

        {/* Right Side: Login Card Form */}
        <div className="bg-slate-900/90 rounded-3xl border border-white/10 shadow-2xl p-8 sm:p-10 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col items-center text-center mb-6">
              <Link
                to="/"
                className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold mb-3 shadow-lg shadow-cyan-500/25 hover:scale-105 transition-transform md:hidden"
              >
                <Fingerprint className="w-6 h-6 text-white" />
              </Link>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Login</h2>
              <p className="text-xs text-slate-400 mt-1">Sign in to your Aura CRM workspace</p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-red-400 text-xs font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-sm bg-white/5 text-white placeholder-slate-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-sm bg-white/5 text-white placeholder-slate-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-600 hover:via-sky-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition-all text-sm disabled:opacity-50 mt-3 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? 'Logging in...' : 'Login'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom subtle copyright */}
      <div className="relative z-10 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} Aura CRM • Enterprise Low-Code Engine
      </div>
    </div>
  );
};
