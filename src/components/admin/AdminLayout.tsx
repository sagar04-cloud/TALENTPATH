import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  KeyRound, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  ArrowRight
} from 'lucide-react';
import { authService } from '../../services/authService';
import { UserAccount } from '../../types';

export const AdminLayout = () => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const verifyUser = () => {
    const user = authService.getSession();
    if (!user) {
      navigate('/login', { replace: true });
    } else {
      setCurrentUser(user);
    }
    setLoading(false);
  };

  useEffect(() => {
    verifyUser();
  }, [navigate]);

  const handleLogout = () => {
    authService.signOut();
    navigate('/login', { replace: true });
  };

  const handleGrantSelfAdmin = () => {
    if (currentUser) {
      authService.updateUserRole(currentUser.id, 'admin');
      verifyUser();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bgLight text-slate-500 text-sm">
        Verifying administrative authorization...
      </div>
    );
  }

  // Access Control Guard: If user is logged in but is NOT an admin
  if (currentUser && currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bgLight p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-soft-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="font-heading font-black text-2xl text-brand-darkText">
              Access Restricted
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your account (<strong>{currentUser.email}</strong>) is currently registered as a <strong>Student / User</strong> and does not have administrative permissions for this panel.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 text-left space-y-2">
            <p className="font-bold text-brand-darkText">Options to proceed:</p>
            <p>1. Switch to your personal Student Portal to track applications.</p>
            <p>2. Or unlock Admin clearance for this evaluation session below.</p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleGrantSelfAdmin}
              className="w-full py-3 px-4 rounded-full bg-brand-blue hover:bg-brand-blueHover text-white text-xs font-bold shadow-pill transition-all"
            >
              Grant Admin Access to {currentUser.full_name}
            </button>

            <Link
              to="/portal"
              className="w-full inline-flex items-center justify-center py-3 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <span>Go to Student Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs text-red-500 hover:underline pt-2 block mx-auto font-medium"
            >
              Sign out and switch account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Leads & Enquiries', path: '/admin/leads', icon: Users },
    { label: 'Academic Programs', path: '/admin/programs', icon: GraduationCap },
    { label: 'User Access Control', path: '/admin/users', icon: KeyRound },
    { label: 'Company Settings', path: '/admin/settings', icon: Settings },
  ];

  const isCurrent = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 flex-col text-white flex-shrink-0 border-r border-slate-800">
        
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" target="_blank" className="flex items-center space-x-2">
            <span className="font-heading font-black text-xl tracking-tighter text-white">
              TALENT<span className="text-brand-blue">PATH</span>
            </span>
          </Link>
          <span className="px-2 py-0.5 rounded-full bg-brand-blue/30 text-blue-300 font-bold text-[10px] uppercase">
            Admin
          </span>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-4 space-y-1.5 text-left">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrent(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                  active
                    ? 'bg-brand-blue text-white shadow-pill'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Current User Card & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center space-x-3 px-2 py-1 text-left">
            <div className="w-8 h-8 rounded-full bg-brand-blue/30 text-blue-200 flex items-center justify-center font-bold text-xs">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">
                {currentUser?.full_name}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {currentUser?.email}
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-xs">
            <Link
              to="/"
              target="_blank"
              className="text-slate-400 hover:text-white inline-flex items-center text-[11px]"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Live Site
            </Link>

            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 inline-flex items-center text-[11px] font-semibold"
            >
              <LogOut className="w-3 h-3 mr-1" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 lg:hidden"
              aria-label="Toggle admin sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-heading font-black text-lg text-brand-darkText">
              Management Portal
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-xs bg-emerald-50 text-emerald-700 px-3.5 py-1 rounded-full border border-emerald-200 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Admin Clearance Active</span>
            </div>
            <Link
              to="/portal"
              className="text-xs font-bold text-slate-600 hover:text-brand-blue"
            >
              Student Portal View
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileSidebarOpen(false)}
          ></div>
          <div className="relative w-64 bg-slate-900 text-white flex flex-col p-4 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <span className="font-bold text-sm">Talent Path Admin</span>
              <button onClick={() => setMobileSidebarOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <nav className="space-y-1 text-left flex-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isCurrent(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-full text-xs font-bold ${
                      active ? 'bg-brand-blue text-white shadow-pill' : 'text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <button
              onClick={handleLogout}
              className="mt-auto py-2 text-red-400 text-xs font-bold flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
