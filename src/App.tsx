// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Shop from './pages/Shop'; // هذا يستورد Shop.tsx

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/shop" element={<Shop />} />
      </Routes>
    </Router>
  );
}

export default App;
