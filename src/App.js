import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/Admin/AdminLogin';
import Boutique from './pages/Boutique/Boutique';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/boutique" element={<Boutique />} />
        <Route path="/" element={<h1>Bienvenue sur Rokhama Déco</h1>} />
      </Routes>
    </Router>
  );
}