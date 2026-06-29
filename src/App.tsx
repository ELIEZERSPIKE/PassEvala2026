import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './store/authContext';
import MainLayout from './layouts/MainLayout';
import ReporterLayout from './layouts/ReporterLayout';
import Login from './features/auth/pages/Login';
import Signup from './features/auth/pages/Signup';
import ToastProvider from './components/Toast/ToastProvider';
import PageTransitionWrapper from './components/Animations/PageTransition';

const App = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1A0A00' }}>
        <p className="text-sm font-bold uppercase tracking-widest" style={{ color: '#D4822A' }}>
          Chargement...
        </p>
      </div>
    );
  }

  const redirectionPath =
    user?.role === 'superadmin' || user?.role === 'admin' ? '/admin' :
    user?.role === 'reporter' ? '/reporter' :
    '/';

  return (
    <Router>
      <ToastProvider />
      <PageTransitionWrapper animation="slide-up" duration={0.4}>
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to={redirectionPath} replace /> : <Login />}
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to={redirectionPath} replace /> : <Signup />}
          />
          {/* Espace reporter — isolé */}
          <Route path="/reporter/*" element={<ReporterLayout />} />
          {/* Espace admin + public */}
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </PageTransitionWrapper>
    </Router>
  );
};

export default App;