import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import App from '../App';
import { AdminHome } from '../pages/admin/AdminHome';
import { AdminArticles } from '../pages/admin/AdminArticles';
import { AdminSponsors } from '../pages/admin/AdminSponsors';
import { ManageStaff } from '../pages/admin/ManageStaff';
import { ArticleForm } from '../features/articles/ArticleForm';
import { useAuth } from '../store/authContext';

const MainLayout = () => {
  const { user } = useAuth();
  
  // Vérification si l'utilisateur est admin ou superadmin
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<App />} />
          
          {isAdmin && (
            <>
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/admin/articles" element={<AdminArticles />} />
              <Route path="/admin/articles/new" element={<ArticleForm />} />
              <Route path="/admin/articles/:id/edit" element={<ArticleForm />} />
              <Route path="/admin/sponsors" element={<AdminSponsors />} />
              <Route path="/admin/settings/roles" element={<ManageStaff />} />
            </>
          )}

          {/* Ajoutez d'autres routes ici */}
          <Route path="/admin/*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
