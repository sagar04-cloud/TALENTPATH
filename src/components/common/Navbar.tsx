import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronDown, 
  GraduationCap, 
  Compass, 
  BookOpen, 
  Clock, 
  ArrowRight,
  Sparkles,
  User,
  ShieldCheck,
  LogOut,
  LogIn
} from 'lucide-react';
import { COMPANY_CONFIG } from '../../config/company';
import { authService } from '../../services/authService';
import { UserAccount } from '../../types';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProgramsDropdownOpen, setIsProgramsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update current session on location change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProgramsDropdownOpen(false);
    setCurrentUser(authService.getSession());
  }, [location.pathname]);

  const handleLogout = () => {
    authService.signOut();
    setCurrentUser(null);
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '';
    return location.pathname.startsWith(path);
  };

  const programLinks = [
    {
      title: "All Degree Programs",
      desc: "Undergraduate & Postgraduate degrees",
      path: "/courses",
      icon: GraduationCap,
    },
    {
      title: "Distance & Flexible Learning",
      desc: "UGC-recognized flexible study schedules",
      path: "/flexible-learning",
      icon: Clock,
    },
    {
      title: "SSLC & PUC Pathways",
      desc: "10th & 12th board completion pathways",
      path: "/sslc-puc",
      icon: BookOpen,
    },
    {
      title: "1-on-1 Career Advisory",
      desc: "Personalized educational counseling",
      path: "/career-guidance",
      icon: Compass,
    }
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-soft-sm py-3 border-b border-slate-100'
          : 'bg-white/90 backdrop-blur-sm py-4 border-b border-slate-100/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo - clean bold like "ARCH" in reference image */}
        <Link to="/" className="flex items-center space-x-2 group">
          <span className="font-heading font-black text-2xl tracking-tighter text-brand-darkText">
            TALENT<span className="text-brand-blue">PATH</span>
          </span>
          <span className="w-2 h-2 rounded-full bg-brand-blue"></span>
        </Link>

        {/* Center Nav Links - clean, light, elegant font */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-3">
          <Link
            to="/"
            className={`px-3.5 py-2 text-xs font-semibold tracking-wide transition-colors rounded-full ${
              isActive('/') ? 'text-brand-blue font-bold' : 'text-slate-600 hover:text-brand-blue'
            }`}
          >
            Home
          </Link>

          {/* Programs Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsProgramsDropdownOpen(true)}
            onMouseLeave={() => setIsProgramsDropdownOpen(false)}
          >
            <button
              className={`px-3.5 py-2 text-xs font-semibold tracking-wide inline-flex items-center transition-colors rounded-full ${
                isActive('/courses') || isActive('/flexible-learning') || isActive('/sslc-puc')
                  ? 'text-brand-blue font-bold'
                  : 'text-slate-600 hover:text-brand-blue'
              }`}
              aria-expanded={isProgramsDropdownOpen}
            >
              <span>Courses & Programs</span>
              <ChevronDown className={`ml-1 w-3.5 h-3.5 transition-transform ${isProgramsDropdownOpen ? 'rotate-180 text-brand-blue' : ''}`} />
            </button>

            {isProgramsDropdownOpen && (
              <div className="absolute top-full left-0 w-80 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="bg-white rounded-3xl shadow-soft-xl border border-slate-100 p-3 space-y-1">
                  {programLinks.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.path}
                      className="flex items-start p-2.5 rounded-2xl hover:bg-brand-blueLight/50 transition-colors group"
                    >
                      <div className="p-2 rounded-xl bg-brand-blueLight text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors mr-3 mt-0.5">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-brand-darkText group-hover:text-brand-blue block">
                          {item.title}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {item.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            to="/career-guidance"
            className={`px-3.5 py-2 text-xs font-semibold tracking-wide transition-colors rounded-full ${
              isActive('/career-guidance') ? 'text-brand-blue font-bold' : 'text-slate-600 hover:text-brand-blue'
            }`}
          >
            Mentors & Guidance
          </Link>

          <Link
            to="/recruitment"
            className={`px-3.5 py-2 text-xs font-semibold tracking-wide transition-colors rounded-full ${
              isActive('/recruitment') ? 'text-brand-blue font-bold' : 'text-slate-600 hover:text-brand-blue'
            }`}
          >
            Corporate Recruitment
          </Link>

          <Link
            to="/contact"
            className={`px-3.5 py-2 text-xs font-semibold tracking-wide transition-colors rounded-full ${
              isActive('/contact') ? 'text-brand-blue font-bold' : 'text-slate-600 hover:text-brand-blue'
            }`}
          >
            Admissions & Contact
          </Link>
        </nav>

        {/* Right CTA & Account Area */}
        <div className="hidden lg:flex items-center space-x-3">
          {currentUser ? (
            <div className="flex items-center space-x-2">
              {currentUser.role === 'admin' && (
                <Link
                  to="/admin"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
                  title="Administrative Management Console"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-blue" />
                  <span>Admin Panel</span>
                </Link>
              )}

              <Link
                to="/portal"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full font-bold text-xs text-brand-blue bg-brand-blueLight hover:bg-brand-blue/20 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-brand-blue" />
                <span>Portal ({currentUser.full_name.split(' ')[0]})</span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full font-semibold text-xs text-slate-700 hover:text-brand-blue hover:bg-slate-50 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span>Sign In / Sign Up</span>
              </Link>

              <Link
                to="/contact?tab=admission"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full font-heading font-bold text-xs text-white bg-brand-blue hover:bg-brand-blueHover shadow-pill hover:shadow-pill-hover transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Enquire Now</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center space-x-2 lg:hidden">
          {currentUser ? (
            <Link
              to={currentUser.role === 'admin' ? '/admin' : '/portal'}
              className="text-xs font-bold px-3 py-1.5 bg-brand-blueLight text-brand-blue rounded-full"
            >
              {currentUser.role === 'admin' ? 'Admin' : 'Portal'}
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-xs font-bold px-3 py-1.5 bg-slate-100 text-slate-800 rounded-full"
            >
              Sign In
            </Link>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-5 pt-4 pb-6 space-y-2 text-left animate-in fade-in duration-200">
          <Link to="/" className="block py-2 text-sm font-semibold text-slate-800">
            Home
          </Link>
          <Link to="/courses" className="block py-2 text-sm font-semibold text-slate-800">
            Courses & Programs
          </Link>
          <Link to="/career-guidance" className="block py-2 text-sm font-semibold text-slate-800">
            Career Guidance
          </Link>
          <Link to="/recruitment" className="block py-2 text-sm font-semibold text-slate-800">
            Corporate Recruitment
          </Link>
          <Link to="/contact" className="block py-2 text-sm font-semibold text-slate-800">
            Admissions & Contact
          </Link>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {currentUser ? (
              <>
                {currentUser.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="w-full inline-flex items-center justify-center py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold"
                  >
                    Admin Management Console
                  </Link>
                )}
                <Link
                  to="/portal"
                  className="w-full inline-flex items-center justify-center py-2.5 rounded-full bg-brand-blueLight text-brand-blue text-xs font-bold"
                >
                  My Student Portal
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full inline-flex items-center justify-center py-2 text-xs font-bold text-rose-600 hover:underline"
                >
                  Sign Out ({currentUser.email})
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center py-2.5 rounded-full border border-slate-200 text-slate-800 text-xs font-bold"
                >
                  Sign In / Sign Up
                </Link>
                <Link
                  to="/contact?tab=admission"
                  className="w-full inline-flex items-center justify-center py-3 rounded-full bg-brand-blue text-white text-xs font-bold uppercase tracking-wider shadow-pill"
                >
                  Enquire Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
