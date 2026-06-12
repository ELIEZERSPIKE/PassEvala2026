import { BrowserRouter as Router } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

export default function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}
