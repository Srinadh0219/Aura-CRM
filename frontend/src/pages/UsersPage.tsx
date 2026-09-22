import React, { useEffect, useState } from 'react';
import { Users as UsersIcon, Shield, ShieldCheck, ShieldAlert, CheckCircle, XCircle, Search, UserCheck } from 'lucide-react';
import api from '../services/api';
import { useAuth, User } from '../context/AuthContext';

const ROLES = [
  { value: 'SUPERADMIN', label: 'Superadmin', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  { value: 'ADMIN', label: 'Admin', color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' },
  { value: 'MEMBER', label: 'Member', color: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
  { value: 'VIEWER', label: 'Viewer', color: 'bg-slate-800 text-slate-400 border-white/10' },
];

export const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.message || 'Failed to load users. Superadmin/Admin role required.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    setMessage(null);
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      setMessage({ text: `User role successfully updated to ${newRole}`, type: 'success' });
      fetchUsers();
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.message || 'Failed to update role. Only Superadmin can change roles.',
        type: 'error',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    setUpdatingId(userId);
    setMessage(null);
    try {
      await api.patch(`/users/${userId}/status`, { isActive: !currentStatus });
      setMessage({
        text: `User account has been ${!currentStatus ? 'activated' : 'deactivated'}`,
        type: 'success',
      });
      fetchUsers();
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.message || 'Failed to update user status',
        type: 'error',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const isSuperadmin = currentUser?.role === 'SUPERADMIN';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <UsersIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">User Management & RBAC</h1>
              <p className="text-xs text-slate-400 mt-0.5">Manage user accounts, role tiers, and access privileges.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            Superadmin Access Active
          </span>
        </div>
      </div>

      {/* Notification Message */}
      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-3 border ${
            message.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-red-500/10 text-red-400 border-red-500/30'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-white/10 shadow-xl flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all"
          />
        </div>
        <div className="text-xs text-slate-400 font-semibold font-mono">
          Total Users: <span className="text-white font-bold">{users.length}</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/90 border border-white/10 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-white/10">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Current Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined Date</th>
                {isSuperadmin && <th className="p-4 text-right">Change Role</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Loading team members...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No users matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSelf = u.id === currentUser?.id;
                  const roleConfig = ROLES.find((r) => r.value === u.role) || ROLES[2];

                  return (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-sky-500/20">
                            {u.firstName?.[0]}
                            {u.lastName?.[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm flex items-center gap-1.5">
                              <span>
                                {u.firstName} {u.lastName}
                              </span>
                              {isSelf && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 font-mono border border-sky-500/20">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-slate-500 text-[11px] font-mono">ID: {u.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-mono text-slate-300 text-xs">{u.email}</td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${roleConfig.color}`}
                        >
                          <Shield className="w-3 h-3" />
                          {roleConfig.label}
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => !isSelf && handleStatusToggle(u.id, u.isActive)}
                          disabled={isSelf || !isSuperadmin}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                            u.isActive
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25'
                          } ${isSelf ? 'cursor-default' : 'cursor-pointer'}`}
                          title={isSelf ? 'Cannot deactivate your own account' : 'Click to toggle status'}
                        >
                          {u.isActive ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              Active
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                              Inactive
                            </>
                          )}
                        </button>
                      </td>

                      <td className="p-4 text-slate-400 font-mono">
                        {new Date(u.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      {isSuperadmin && (
                        <td className="p-4 text-right">
                          <select
                            disabled={updatingId === u.id || isSelf}
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="px-3 py-1.5 border border-white/10 rounded-xl text-xs bg-slate-950 focus:outline-none focus:border-indigo-500 font-medium text-slate-200 disabled:opacity-50 cursor-pointer shadow-sm"
                          >
                            {ROLES.map((r) => (
                              <option key={r.value} value={r.value} className="bg-slate-900 text-white">
                                Change to {r.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
