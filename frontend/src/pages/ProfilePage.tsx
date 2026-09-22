import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Shield, Lock, CheckCircle, AlertCircle, Save, KeyRound, Sparkles } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  // Personal info state
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoMsg, setInfoMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoMsg(null);
    setInfoLoading(true);

    try {
      const res = await api.patch('/auth/profile', { firstName, lastName });
      updateUser(res.data);
      setInfoMsg({ text: 'Profile details updated successfully!', type: 'success' });
    } catch (err: any) {
      setInfoMsg({
        text: err.response?.data?.message || 'Failed to update profile',
        type: 'error',
      });
    } finally {
      setInfoLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);

    if (newPassword.length < 6) {
      setPassMsg({ text: 'New password must be at least 6 characters long', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassMsg({ text: 'New password and confirm password do not match', type: 'error' });
      return;
    }

    setPassLoading(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      setPassMsg({ text: 'Password changed successfully!', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPassMsg({
        text: err.response?.data?.message || 'Failed to change password. Check your current password.',
        type: 'error',
      });
    } finally {
      setPassLoading(false);
    }
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'SUPERADMIN':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'ADMIN':
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      case 'MEMBER':
        return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-white/10';
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Account Settings & Profile</h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage your personal profile details and security credentials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: User Summary Card */}
        <div className="bg-slate-900/90 rounded-3xl border border-white/10 p-6 shadow-xl flex flex-col items-center text-center space-y-4 backdrop-blur-md">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg shadow-sky-500/25">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{user?.email}</p>
          </div>

          <div className="w-full pt-4 border-t border-white/10 space-y-4 text-left">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                Your Assigned Role
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border ${getRoleBadgeColor(
                  user?.role,
                )}`}
              >
                <Shield className="w-3.5 h-3.5" />
                {user?.role}
              </span>
              <p className="text-[11px] text-slate-500 mt-1.5 italic">
                * Roles are managed and promoted exclusively by Superadmins.
              </p>
            </div>

            <div className="pt-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Account ID</div>
              <div className="text-xs font-mono text-slate-400 truncate mt-0.5">{user?.id}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Form */}
          <div className="bg-slate-900/90 rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-white/10">
              <User className="w-5 h-5 text-sky-400" />
              <div>
                <h3 className="font-bold text-white text-base">Personal Information</h3>
                <p className="text-xs text-slate-400">Update your public display name</p>
              </div>
            </div>

            {infoMsg && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 border ${
                  infoMsg.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                }`}
              >
                {infoMsg.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                )}
                <span>{infoMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-3.5 py-2.5 border border-white/5 bg-slate-950/60 rounded-xl text-xs text-slate-500 cursor-not-allowed font-mono"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Email address cannot be modified directly.</span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={infoLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  {infoLoading ? 'Saving...' : 'Save Profile Details'}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-slate-900/90 rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-white/10">
              <KeyRound className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="font-bold text-white text-base">Security & Password</h3>
                <p className="text-xs text-slate-400">Update your login authentication credentials</p>
              </div>
            </div>

            {passMsg && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 border ${
                  passMsg.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                }`}
              >
                {passMsg.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                )}
                <span>{passMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={passLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  {passLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
