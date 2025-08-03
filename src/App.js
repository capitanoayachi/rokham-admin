import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Boutique from './Boutique/Boutique'; // تأكد من أن هذا المسار صحيح

function App() {
  return (
    <Router>
      <Routes>
        {/* إذا غيرت المسار من /shop إلى /boutique */}
        <Route path="/boutique" element={<Boutique />} />
        
        {/* أو أضف كليهما للتوافقية */}
        <Route path="/shop" element={<Boutique />} />
        <Route path="/boutique" element={<Boutique />} />
      </Routes>
    </Router>
  );
}