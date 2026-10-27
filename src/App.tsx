import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { PublicLayout } from './components/common/PublicLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Public pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CoursesPage } from './pages/CoursesPage';
import { CareerGuidancePage } from './pages/CareerGuidancePage';
import { FlexibleLearningPage } from './pages/FlexibleLearningPage';
import { SslcPucPage } from './pages/SslcPucPage';
import { RecruitmentPage } from './pages/RecruitmentPage';
import { NewsPage } from './pages/NewsPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AuthPage } from './pages/AuthPage';
import { UserPortalPage } from './pages/UserPortalPage';

// Admin pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminLeadsPage } from './pages/admin/AdminLeadsPage';
import { AdminProgramsPage } from './pages/admin/AdminProgramsPage';
import { AdminNewsPage } from './pages/admin/AdminNewsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Analytics initialization
import { initGA } from './lib/analytics';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export function App() {
  useEffect(() => {
    initGA();
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes with Global Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/career-guidance" element={<CareerGuidancePage />} />
            <Route path="/flexible-learning" element={<FlexibleLearningPage />} />
            <Route path="/sslc-puc" element={<SslcPucPage />} />
            <Route path="/recruitment" element={<RecruitmentPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:slug" element={<NewsDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-conditions" element={<TermsPage />} />
          </Route>

          {/* User / Student Portal */}
          <Route path="/portal" element={<UserPortalPage />} />

          {/* Authentication Routes (Unified Sign In / Sign Up) */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/admin/login" element={<AuthPage />} />

          {/* Authenticated Admin Management Portal */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="leads" element={<AdminLeadsPage />} />
            <Route path="programs" element={<AdminProgramsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="news" element={<AdminNewsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* 404 Catch-All Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
