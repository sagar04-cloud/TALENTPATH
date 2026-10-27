import { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  GraduationCap,
  X,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertTriangle
} from 'lucide-react';
import { authService } from '../../services/authService';
import { UserAccount, UserRole } from '../../types';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Reset Password Modal State
  const [resetModalUser, setResetModalUser] = useState<UserAccount | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  // Delete User Modal State
  const [deleteModalUser, setDeleteModalUser] = useState<UserAccount | null>(null);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  const currentSession = authService.getSession();

  // Load users via real-time subscription
  useEffect(() => {
    setLoading(true);
    const unsubscribe = authService.subscribeToUsers((list) => {
      setUsers(list || []);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      const list = await authService.getAllUsers();
      setUsers(list || []);
      setFeedback({ message: 'User directory synced with cloud database.', type: 'info' });
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback({ message: 'Directory refreshed from local cache.', type: 'info' });
      setTimeout(() => setFeedback(null), 2500);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole, userName: string, isSelf: boolean) => {
    if (isSelf && newRole !== 'admin') {
      setFeedback({ 
        message: 'Security Guard: You cannot revoke admin clearance from your own active session.', 
        type: 'error' 
      });
      setTimeout(() => setFeedback(null), 4000);
      return;
    }

    setUpdatingId(userId);
    try {
      await authService.updateUserRole(userId, newRole);
      setFeedback({
        message: `Successfully updated permissions for ${userName || 'user'} to ${newRole === 'admin' ? 'Administrator' : 'Student / Candidate'}.`,
        type: 'success'
      });
      setTimeout(() => setFeedback(null), 3500);
    } catch (err: any) {
      setFeedback({
        message: err?.message || 'Failed to update access role. Please try again.',
        type: 'error'
      });
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenResetModal = (target: UserAccount) => {
    setResetModalUser(target);
    const prefixes = ['Talent', 'Pass', 'Gateway', 'Secure', 'EduPath'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(1000 + Math.random() * 9000);
    setNewPassword(`${prefix}@${num}!`);
    setShowPassword(true);
    setCopiedPass(false);
  };

  const handleGenerateRandomPassword = () => {
    const prefixes = ['Talent', 'Pass', 'Gateway', 'Secure', 'EduPath', 'Solutions'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(1000 + Math.random() * 9000);
    const symbols = ['!', '@', '#', '$'];
    const sym = symbols[Math.floor(Math.random() * symbols.length)];
    setNewPassword(`${prefix}@${num}${sym}`);
    setCopiedPass(false);
  };

  const handleCopyPassword = () => {
    if (!newPassword) return;
    navigator.clipboard.writeText(newPassword);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalUser) return;
    if (!newPassword || newPassword.trim().length < 6) {
      setFeedback({ message: 'Password must be at least 6 characters long.', type: 'error' });
      return;
    }

    setIsSubmittingReset(true);
    try {
      const result = await authService.resetUserPassword(resetModalUser.id, newPassword.trim());
      if (result.success) {
        setFeedback({
          message: `Password for ${resetModalUser.full_name} (${resetModalUser.email}) reset successfully to: "${newPassword.trim()}".`,
          type: 'success'
        });
        setResetModalUser(null);
        setTimeout(() => setFeedback(null), 8000);
      } else {
        setFeedback({
          message: result.error || 'Failed to reset password. Please try again.',
          type: 'error'
        });
      }
    } catch (err: any) {
      setFeedback({
        message: err?.message || 'Error occurred while resetting password.',
        type: 'error'
      });
    } finally {
      setIsSubmittingReset(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalUser) return;
    setIsSubmittingDelete(true);
    try {
      const result = await authService.deleteUser(deleteModalUser.id);
      if (result.success) {
        setFeedback({
          message: `Account for ${deleteModalUser.full_name} (${deleteModalUser.email}) has been permanently deleted.`,
          type: 'success'
        });
        setDeleteModalUser(null);
        setTimeout(() => setFeedback(null), 5000);
      } else {
        setFeedback({
          message: result.error || 'Failed to delete account.',
          type: 'error'
        });
      }
    } catch (err: any) {
      setFeedback({
        message: err?.message || 'Error occurred while deleting account.',
        type: 'error'
      });
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  // Safe search and role filtering - will NEVER throw if property is null/undefined
  const filtered = users.filter((u) => {
    if (!u) return false;
    const name = (u.full_name || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const phone = (u.phone || '').toLowerCase();
    const q = search.trim().toLowerCase();

    const matchesSearch = !q || name.includes(q) || email.includes(q) || phone.includes(q);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const candidateCount = users.filter((u) => u.role !== 'admin').length;

  return (
    <div className="space-y-6 text-left">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-heading font-black text-2xl text-brand-darkText">
              User Access & Permissions Control
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
              Live Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage registered accounts, view student logins, and grant Administrative Clearance to authorized team members.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all disabled:opacity-50"
            title="Refresh directory from cloud"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 text-slate-500 ${refreshing ? 'animate-spin text-brand-blue' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Dynamic Feedback Banner */}
      {feedback && (
        <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between transition-all animate-in fade-in slide-in-from-top-1 ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
            : feedback.type === 'error'
              ? 'bg-rose-50 border border-rose-200 text-rose-800'
              : 'bg-indigo-50 border border-indigo-200 text-indigo-800'
        }`}>
          <div className="flex items-center space-x-2">
            {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
            {feedback.type === 'error' && <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />}
            {feedback.type === 'info' && <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />}
            <span>{feedback.message}</span>
          </div>
          <button 
            onClick={() => setFeedback(null)} 
            className="text-slate-400 hover:text-slate-600 ml-3"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Accounts */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-soft flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-heading font-black text-brand-darkText">
              {loading ? '...' : totalUsers}
            </div>
            <div className="text-[11px] font-medium text-slate-400">Total Registered Users</div>
          </div>
        </div>

        {/* Administrators */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-soft flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-heading font-black text-emerald-700">
              {loading ? '...' : adminCount}
            </div>
            <div className="text-[11px] font-medium text-slate-400">Admin Clearance Accounts</div>
          </div>
        </div>

        {/* Students / Candidates */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-soft flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-heading font-black text-brand-darkText">
              {loading ? '...' : candidateCount}
            </div>
            <div className="text-[11px] font-medium text-slate-400">Student & Candidate Users</div>
          </div>
        </div>
      </div>

      {/* Info Notice Box */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-brand-blue/20 text-xs text-slate-700 flex items-start space-x-3">
        <KeyRound className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-brand-darkText">Permissions & Clearance Information:</span>
          <p className="text-slate-600">
            Users registered as <strong className="text-slate-700">Student / User</strong> can only access their personal application dashboard. Granting <strong className="text-emerald-700">Admin Clearance</strong> allows team members full access to manage enquiries, admissions, programs, and user roles in this CRM console.
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-full border border-slate-200 text-xs bg-white focus:outline-none focus:border-brand-blue shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Role Filter Tabs */}
        <div className="inline-flex p-1 rounded-full bg-slate-100 border border-slate-200 text-xs self-start sm:self-auto">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all ${
              roleFilter === 'all'
                ? 'bg-white text-brand-darkText shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All ({totalUsers})
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all ${
              roleFilter === 'admin'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Admins ({adminCount})
          </button>
          <button
            onClick={() => setRoleFilter('user')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all ${
              roleFilter === 'user'
                ? 'bg-white text-brand-darkText shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Students ({candidateCount})
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 font-heading text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="p-4">User Details</th>
                <th className="p-4">Contact Phone</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Current Clearance</th>
                <th className="p-4 text-right">Access Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <RefreshCw className="w-5 h-5 text-brand-blue animate-spin" />
                      <span>Loading user directory...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Users className="w-8 h-8 text-slate-300" />
                      <p className="font-semibold text-slate-600">No user accounts found matching your query.</p>
                      {search && (
                        <button
                          onClick={() => { setSearch(''); setRoleFilter('all'); }}
                          className="text-xs text-brand-blue hover:underline"
                        >
                          Clear search and filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const isAdmin = u.role === 'admin';
                  const isUpdating = updatingId === u.id;
                  
                  // Detect active logged-in admin session
                  const isSelf = Boolean(
                    (currentSession?.id && currentSession.id === u.id) ||
                    (currentSession?.email && u.email && currentSession.email.toLowerCase() === u.email.toLowerCase())
                  );

                  const initialLetter = (u.full_name || u.email || 'U').charAt(0).toUpperCase();
                  const displayDate = u.created_at 
                    ? new Date(u.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) 
                    : 'Recent';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* User Column */}
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                            isAdmin 
                              ? 'bg-gradient-to-br from-brand-blue to-indigo-600 text-white shadow-sm' 
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {initialLetter}
                          </div>
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="font-bold text-brand-darkText block text-sm">
                                {u.full_name || 'Candidate User'}
                              </span>
                              {isSelf && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-brand-blueLight text-brand-blue">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 block">
                              {u.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Phone Column */}
                      <td className="p-4">
                        <span className="text-slate-600 font-medium">
                          {u.phone && u.phone.trim() ? u.phone : (
                            <span className="text-slate-400 italic">Not provided</span>
                          )}
                        </span>
                      </td>

                      {/* Date Column */}
                      <td className="p-4 whitespace-nowrap text-slate-500">
                        {displayDate}
                      </td>

                      {/* Current Role Badge */}
                      <td className="p-4 whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isAdmin 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {isAdmin ? (
                            <>
                              <ShieldCheck className="w-3 h-3 text-emerald-600 mr-1" />
                              <span>Admin Clearance</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3 h-3 text-slate-500 mr-1" />
                              <span>Student / Candidate</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Action Column */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-2">
                          {/* Role Toggle Button */}
                          {isAdmin ? (
                            isSelf ? (
                              <span 
                                className="px-2.5 py-1.5 rounded-full bg-slate-100 text-slate-400 text-[11px] font-bold inline-flex items-center cursor-not-allowed"
                                title="You cannot revoke your own active admin session."
                              >
                                <ShieldCheck className="w-3 h-3 mr-1 text-slate-400" />
                                <span>Active</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => handleRoleChange(u.id, 'user', u.full_name, isSelf)}
                                disabled={isUpdating}
                                className="px-2.5 py-1.5 rounded-full border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[11px] font-bold transition-colors inline-flex items-center disabled:opacity-50"
                                title="Revoke Admin Access and revert to standard student account"
                              >
                                {isUpdating ? (
                                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                                ) : (
                                  <UserX className="w-3 h-3 mr-1" />
                                )}
                                <span>Revoke</span>
                              </button>
                            )
                          ) : (
                            <button
                              onClick={() => handleRoleChange(u.id, 'admin', u.full_name, isSelf)}
                              disabled={isUpdating}
                              className="px-2.5 py-1.5 rounded-full bg-brand-blue hover:bg-brand-blueHover text-white text-[11px] font-bold transition-all shadow-soft inline-flex items-center disabled:opacity-50"
                              title="Grant full administrative clearance to access the management portal"
                            >
                              {isUpdating ? (
                                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                              ) : (
                                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                              )}
                              <span>Make Admin</span>
                            </button>
                          )}

                          {/* Reset Password Button */}
                          <button
                            onClick={() => handleOpenResetModal(u)}
                            className="px-2.5 py-1.5 rounded-full border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold transition-colors inline-flex items-center shadow-xs"
                            title="Reset password for this account"
                          >
                            <KeyRound className="w-3 h-3 mr-1 text-indigo-600" />
                            <span>Reset Pass</span>
                          </button>

                          {/* Delete Account Button */}
                          {isSelf ? (
                            <span 
                              className="p-1.5 rounded-full bg-slate-100 text-slate-300 cursor-not-allowed inline-flex items-center"
                              title="Security Guard: You cannot delete your own active admin account."
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <button
                              onClick={() => setDeleteModalUser(u)}
                              className="p-1.5 rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 transition-colors inline-flex items-center shadow-xs"
                              title="Permanently delete this user account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with summary */}
        {!loading && filtered.length > 0 && (
          <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span>
              Showing <strong className="text-slate-700">{filtered.length}</strong> of <strong className="text-slate-700">{totalUsers}</strong> total registered accounts
            </span>
            <span className="text-[11px] text-slate-400">
              Changes update locally and synchronize with Firebase Cloud Realtime Database instantly.
            </span>
          </div>
        )}
      </div>

      {/* Reset Password Modal */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-left space-y-5 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-brand-navy">
                    Reset Account Password
                  </h3>
                  <p className="text-xs text-slate-500">
                    Set a new login password for this user
                  </p>
                </div>
              </div>
              <button
                onClick={() => setResetModalUser(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Account Details Banner */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 text-xs">{resetModalUser.full_name}</p>
                <p className="text-[11px] text-slate-500">{resetModalUser.email}</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                resetModalUser.role === 'admin'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {resetModalUser.role === 'admin' ? 'Administrator' : 'Student / User'}
              </span>
            </div>

            {/* Password Form */}
            <form onSubmit={handleConfirmReset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-brand-blue"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyPassword}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center space-x-1 transition-colors"
                      title="Copy password"
                    >
                      {copiedPass ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedPass ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Generator Shortcut */}
              <div className="flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={handleGenerateRandomPassword}
                  className="text-brand-blue hover:text-brand-blueHover font-bold inline-flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Strong Password</span>
                </button>
                <span className="text-slate-400 text-[10px]">Min. 6 chars</span>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-[11px] text-amber-800 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  The account holder will be able to sign in immediately using this new password across all devices.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  disabled={isSubmittingReset}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReset || !newPassword}
                  className="px-5 py-2 rounded-xl bg-brand-blue hover:bg-brand-blueHover text-white text-xs font-bold transition-all shadow-soft flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {isSubmittingReset ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Save New Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {deleteModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-left space-y-5 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-rose-700">
                    Delete User Account
                  </h3>
                  <p className="text-xs text-slate-500">
                    Permanent action — please confirm
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDeleteModalUser(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Warning Message */}
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs text-rose-900 space-y-2">
              <p className="font-bold">
                Are you sure you want to permanently delete this account?
              </p>
              <div className="p-2.5 rounded-xl bg-white/80 border border-rose-100 text-slate-700">
                <p className="font-bold text-slate-900">{deleteModalUser.full_name}</p>
                <p className="text-slate-500 text-[11px]">{deleteModalUser.email}</p>
                <span className="inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {deleteModalUser.role === 'admin' ? 'Administrator' : 'Student Account'}
                </span>
              </div>
              <p className="text-[11px] text-rose-700">
                This account will immediately lose portal access and cannot log in anymore. All access clearance will be terminated.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteModalUser(null)}
                disabled={isSubmittingDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isSubmittingDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-soft flex items-center space-x-1.5 disabled:opacity-50"
              >
                {isSubmittingDelete ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Permanently Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
