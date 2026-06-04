import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import App from '../App';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<App />} />
          {/* Ajoutez d'autres routes ici */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
