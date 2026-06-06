import React, { useState } from 'react';
import { Shield, Plus, Search, UserCheck, X, Eye, EyeOff } from 'lucide-react';
import { AdminUser } from '../../types';

interface AdminManagementViewProps {
  admins: AdminUser[];
  onAddAdmin: (email: string, role: string) => void;
}

export default function AdminManagementView({ admins, onAddAdmin }: AdminManagementViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    // As per user instruction: "Email/ password -> Không cần ràng buộc" (No constraints/restrictions needed)
    // We will do a basic empty check, but no regex/length checks.
    if (!email.trim()) {
      setError('Email cannot be empty.');
      return;
    }
    if (!password.trim()) {
      setError('Password cannot be empty.');
      return;
    }

    onAddAdmin(email.trim(), role);

    // Reset form & close
    setEmail('');
    setPassword('');
    setRole('Admin');
    setShowPassword(false);
    setError(null);
    setIsModalOpen(false);
  };

  const filteredAdmins = admins.filter(admin =>
    admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in" id="admin-management-panel">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight">Admin User Management</h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Manage administrator accounts with access to the Mini App CMS system.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-xs font-semibold font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-md w-full sm:w-auto"
          id="btn-create-admin"
        >
          <Plus className="w-4 h-4" /> Create Admin
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-lg bg-blue-950/50 border border-blue-500/25 flex items-center justify-center text-blue-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-mono block uppercase">Total CMS Admins</span>
            <span className="text-xl font-bold text-white font-display mt-0.5 block">{admins.length}</span>
          </div>
        </div>

        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-lg bg-emerald-950/50 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-mono block uppercase">Role Permissions</span>
            <span className="text-xs font-semibold text-emerald-400 mt-1 block">Full Read/Write Access</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 shadow-lg">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search admins by email or role..."
            className="w-full bg-[#0a0e17] border border-[#1e2638] rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0c101a] text-[10px] font-mono tracking-wider text-slate-405 border-b border-[#1e2638] select-none">
                <th className="py-3 px-4 md:px-6 font-semibold uppercase whitespace-nowrap">Admin ID</th>
                <th className="py-3 px-4 md:px-6 font-semibold uppercase whitespace-nowrap">Email Address</th>
                <th className="py-3 px-4 md:px-6 font-semibold uppercase whitespace-nowrap">Role</th>
                <th className="py-3 px-4 md:px-6 font-semibold uppercase whitespace-nowrap">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2638] text-sm">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 px-6 text-center text-slate-500 font-mono text-xs">
                    No admin accounts found matching your search.
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-[#161d2d]/35 transition-colors duration-150">
                    <td className="py-4 px-4 md:px-6 text-xs font-mono text-slate-400">
                      {admin.id}
                    </td>
                    <td className="py-4 px-4 md:px-6 font-semibold text-white whitespace-nowrap">
                      {admin.email}
                    </td>
                    <td className="py-4 px-4 md:px-6 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium ${admin.role === 'Super Admin'
                          ? 'bg-purple-950/40 text-purple-400 border border-purple-500/20'
                          : admin.role === 'Admin'
                            ? 'bg-blue-950/40 text-blue-400 border border-blue-500/20'
                            : 'bg-slate-800 text-slate-300 border border-[#1e2638]'
                        }`}>
                        {admin.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 md:px-6 text-xs font-mono text-slate-400 whitespace-nowrap">
                      {admin.createdDate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />

          <div className="relative w-full max-w-md bg-[#121824] border border-[#263147] rounded-xl shadow-2xl overflow-hidden animate-zoom-in">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0c101a] border-b border-[#1e2638] flex items-center justify-between">
              <h3 className="font-display font-medium text-white text-base">Create New Admin Account</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-lg text-xs text-red-400 font-mono">
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-450 uppercase">Email Address</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full bg-[#0a0e17] border border-[#1e2638] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-650 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-450 uppercase">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full bg-[#0a0e17] border border-[#1e2638] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-650 pr-10 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-450 uppercase">Role / Permission</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#0a0e17] border border-[#1e2638] rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Moderator">Moderator</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e2638]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white border border-[#1e2638] rounded-lg text-xs font-semibold font-mono tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold font-mono tracking-wider uppercase transition-colors cursor-pointer shadow-md"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
