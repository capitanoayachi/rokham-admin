// src/pages/Shop.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Fetch products error:', error);
      setErrorMsg('فشل جلب المنتجات.');
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: 'auto' }}>
      <h1>متجر Rokhama Déco</h1>
      {loading && <p>جاري تحميل المنتجات...</p>}
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {!loading && products.length === 0 && <p>لا توجد منتجات.</p>}
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
