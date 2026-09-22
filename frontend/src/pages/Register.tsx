import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Layers,
  Lock,
  Mail,
  User,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Database,
  Shield,
  Zap,
  Sparkles,
} from 'lucide-react';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/register', {
        email,
        password,
        firstName,
        lastName,
      });
      login(res.data.accessToken, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-6 relative overflow-hidden selection:bg-sky-500 selection:text-white">
      {/* Ambient background glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sky-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Link: Back to Home */}
      <div className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Centered Content: Symmetrical 3D Emblem Box + Register Box */}
      <div className="relative z-10 my-auto max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Left Side: Compact 3D Animated Project Emblem Box */}
        <div className="hidden md:flex flex-col justify-between items-center text-center p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
          {/* Subtle internal glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 via-transparent to-indigo-500/10 pointer-events-none" />

          {/* Top Badge */}
          <div className="relative z-10 w-full flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-sky-400">
              <Sparkles className="w-3 h-3" />
              Low-Code Engine
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 font-bold border border-sky-500/20">
              v2.0
            </span>
          </div>

          {/* Center 3D Animated Icon Emblem */}
          <div className="relative my-auto py-6 flex flex-col items-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Pulsing & Spinning Outer Rings */}
              <div className="absolute inset-0 rounded-full border border-sky-500/20 animate-ping opacity-25" />
              <div className="absolute -inset-3 rounded-full border border-dashed border-indigo-500/30 animate-spin [animation-duration:20s]" />
              <div className="absolute -inset-6 rounded-full border border-sky-400/15 animate-spin [animation-duration:30s] [animation-direction:reverse]" />

              {/* Central Glowing 3D Layers Stack */}
              <div className="animate-float relative z-10 w-24 h-24 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-sky-400 p-0.5 shadow-2xl shadow-sky-500/30 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950/85 rounded-[14px] backdrop-blur-xl flex items-center justify-center border border-white/20">
                  <Layers className="w-11 h-11 text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]" />
                </div>
              </div>

              {/* Floating Satellites */}
              <div className="animate-float-reverse absolute -top-1 -right-1 w-9 h-9 rounded-xl bg-slate-900/90 border border-indigo-500/40 shadow-md flex items-center justify-center text-indigo-400">
                <Database className="w-4 h-4" />
              </div>
              <div className="animate-float absolute -bottom-1 -left-1 w-9 h-9 rounded-xl bg-slate-900/90 border border-sky-500/40 shadow-md flex items-center justify-center text-sky-400">
                <Shield className="w-4 h-4" />
              </div>
              <div className="animate-float-reverse absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-slate-900/90 border border-emerald-500/40 shadow-md flex items-center justify-center text-emerald-400">
                <Zap className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-4 space-y-1.5">
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Aura{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400">
                  CRM
                </span>
              </h3>
              <p className="text-xs text-slate-400 max-w-[220px]">
                Build dynamic modules, automated workflows & instant tables.
              </p>
            </div>
          </div>

          {/* Bottom Tech Pills */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-1.5 pt-4 border-t border-white/10 w-full">
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-sky-300">
              React
            </span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-indigo-300">
              TypeScript
            </span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-red-300">
              NestJS
            </span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-emerald-300">
              PostgreSQL
            </span>
          </div>
        </div>

        {/* Right Side: Register Card Form */}
        <div className="bg-slate-900/90 rounded-3xl border border-white/10 shadow-2xl p-8 sm:p-10 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col items-center text-center mb-6">
              <Link
                to="/"
                className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold mb-3 shadow-lg shadow-sky-500/25 hover:scale-105 transition-transform md:hidden"
              >
                <Layers className="w-6 h-6" />
              </Link>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Register</h2>
              <p className="text-xs text-slate-400 mt-1">Create your Aura CRM account</p>
            </div>

            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-red-400 text-xs font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">First Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/10 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 text-sm bg-white/5 text-white placeholder-slate-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full px-3 py-2.5 rounded-xl border border-white/10 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 text-sm bg-white/5 text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 text-sm bg-white/5 text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 text-sm bg-white/5 text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-sky-500/25 transition-all text-sm disabled:opacity-50 mt-2 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? 'Creating Account...' : 'Register'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-sky-400 hover:text-sky-300 hover:underline">
              Login
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
