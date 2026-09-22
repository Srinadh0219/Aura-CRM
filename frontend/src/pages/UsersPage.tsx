import React, { useEffect, useState } from 'react';
import { Users as UsersIcon, Shield, ShieldCheck, ShieldAlert, CheckCircle, XCircle, Search, UserCheck } from 'lucide-react';
import api from '../services/api';
import { useAuth, User } from '../context/AuthContext';

const ROLES = [
  { value: 'SUPERADMIN', label: 'Superadmin', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'ADMIN', label: 'Admin', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { value: 'MEMBER', label: 'Member', color: 'bg-sky-100 text-sky-700 border-sky-200' },
  { value: 'VIEWER', label: 'Viewer', color: 'bg-slate-100 text-slate-700 border-slate-200' },
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
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <UsersIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">User Management & RBAC</h1>
              <p className="text-sm text-slate-500">Manage user accounts, roles, and access levels.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Superadmin Access Active
          </span>
        </div>
      </div>

      {/* Notification Message */}
      {message && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-3 border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          Total Users: <span className="text-slate-800">{users.length}</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Current Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined Date</th>
                {isSuperadmin && <th className="p-4 text-right">Change Role</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
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
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                            {u.firstName?.[0]}
                            {u.lastName?.[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                              <span>
                                {u.firstName} {u.lastName}
                              </span>
                              {isSelf && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-slate-400 text-[11px]">ID: {u.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-mono text-slate-600 text-xs">{u.email}</td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${roleConfig.color}`}
                        >
                          <Shield className="w-3.5 h-3.5" />
                          {roleConfig.label}
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => !isSelf && handleStatusToggle(u.id, u.isActive)}
                          disabled={isSelf || !isSuperadmin}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            u.isActive
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-700 hover:bg-red-100'
                          } ${isSelf ? 'cursor-default' : 'cursor-pointer'}`}
                          title={isSelf ? 'Cannot deactivate your own account' : 'Click to toggle status'}
                        >
                          {u.isActive ? (
                            <>
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                              Active
                            </>
                          ) : (
                            <>
                              <span className="w-2 h-2 rounded-full bg-red-500"></span>
                              Inactive
                            </>
                          )}
                        </button>
                      </td>

                      <td className="p-4 text-slate-500">
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
                            className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 disabled:opacity-50 cursor-pointer shadow-sm"
                          >
                            {ROLES.map((r) => (
                              <option key={r.value} value={r.value}>
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
