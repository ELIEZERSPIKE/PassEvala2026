import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/store/authContext';
import { ReporterHome } from '@/pages/ReporterHome';
import { AppNavbar } from '@/components/AppNavBar';
import { ReporterArticles } from '@/features/reporter/pages/ReporterArticles';
import { ReporterFlashInfo } from '@/features/reporter/pages/ReporterFlashInfo';
import { ReporterShorts } from '@/features/reporter/pages/ReporterShorts';
import { ArticleForm } from '@/features/articles/ArticleForm';

const ReporterLayout = () => {
  const { user } = useAuth();

  if (user?.role !== 'reporter') return <Navigate to="/" replace />;

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">

      {/* Navbar unique pour tout l'espace reporter */}
      <AppNavbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/"                  element={<ReporterHome />} />
          <Route path="/articles"          element={<ReporterArticles />} />
          <Route path="/articles/new"      element={<ArticleForm />} />
          <Route path="/articles/:id/edit" element={<ArticleForm />} />
          <Route path="/flash-info"        element={<ReporterFlashInfo />} />
          <Route path="/shorts"            element={<ReporterShorts />} />
          <Route path="*"                  element={<Navigate to="/reporter" replace />} />
        </Routes>
      </main>

    </div>
  );
};

export default ReporterLayout;