import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HomePage from '../pages/Home';
import { AdminHome } from '../pages/admin/AdminHome';
import { AdminArticles } from '../pages/admin/AdminArticles';
import { AdminSponsors } from '../pages/admin/AdminSponsors';
import { ManageStaff } from '../pages/admin/ManageStaff';
import { ArticleForm } from '../features/articles/ArticleForm';
import { useAuth } from '../store/authContext';
import SponsorForm from '../features/sponsors/components/SponsorForm';
import { AdminBonPlans } from '../pages/admin/AdminBonPlans';
import BonPlanForm from '../features/bon-plans/components/BonPlanForm';
import { bonPlanService } from '../services/bonPlanService';

const MainLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Vérification si l'utilisateur est admin ou superadmin
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {isAdmin && (
            <>
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/admin/articles" element={<AdminArticles />} />
              <Route path="/admin/articles/new" element={<ArticleForm />} />
              <Route path="/admin/articles/:id/edit" element={<ArticleForm />} />
              <Route path="/admin/sponsors" element={<AdminSponsors />} />
              <Route path="/admin/bons-plans" element={<AdminBonPlans />} />
              <Route path="/admin/bon-plans" element={<AdminBonPlans />} />
              <Route path="/admin/bonplans/new" element={<BonPlanNewWrapper />} />
              <Route path="/admin/bonplans/:id/edit" element={<BonPlanEditWrapper />} />
              <Route 
                path="/admin/sponsors/new" 
                element={
                  <div className="p-6 max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Nouveau Sponsor</h1>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <SponsorForm onSuccess={() => navigate('/admin/sponsors')} onCancel={() => navigate('/admin/sponsors')} />
                    </div>
                  </div>
                } 
              />
              <Route path="/admin/sponsors/edit/:id" element={<SponsorEditWrapper />} />
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

/**
 * Petit composant wrapper pour l'édition car SponsorForm a besoin 
 * de l'objet sponsor complet, et non juste de l'ID.
 */
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { sponsorService } from '../services/sponsorService';
import { Sponsor } from '../features/sponsors/components/SponsorForm';

const SponsorEditWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sponsor, setSponsor] = useState<Sponsor | null>(null);

  useEffect(() => {
    // Ici, il faudrait idéalement une méthode getById dans ton service
    // Pour l'exemple, on peut recharger la liste ou adapter le service
    sponsorService.getPublicSponsors().then(list => {
      const found = list.find(s => s.id === Number(id));
      if (found) setSponsor(found);
    });
  }, [id]);

  if (!sponsor) return <div className="p-10 text-center">Chargement du sponsor...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Modifier le Sponsor : {sponsor.name}</h1>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <SponsorForm sponsor={sponsor} onSuccess={() => navigate('/admin/sponsors')} onCancel={() => navigate('/admin/sponsors')} />
      </div>
    </div>
  );
};

const BonPlanNewWrapper = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nouveau Bon Plan</h1>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <BonPlanForm onSuccess={() => navigate('/admin/bons-plans')} onCancel={() => navigate('/admin/bons-plans')} />
      </div>
    </div>
  );
};

const BonPlanEditWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bonPlan, setBonPlan] = useState<any>(null);

  useEffect(() => {
    if (id) {
      bonPlanService.getOne(Number(id)).then(data => {
        if (data) setBonPlan(data);
      }).catch(err => console.error(err));
    }
  }, [id]);

  if (!bonPlan) return <div className="p-10 text-center">Chargement du bon plan...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Modifier le Bon Plan : {bonPlan.title}</h1>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <BonPlanForm bonPlan={bonPlan} onSuccess={() => navigate('/admin/bons-plans')} onCancel={() => navigate('/admin/bons-plans')} />
      </div>
    </div>
  );
};

export default MainLayout;
