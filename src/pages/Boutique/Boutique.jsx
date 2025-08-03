// src/Shop/Shop.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import './Shop.css'; // ← سيتم إنشاؤه بعد قليل

export default function Shop() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (data) {
        setProducts(data.map(p => ({
          ...p,
          // تنظيف الروابط هنا
          image_url: p.image_url?.replace(/([^:]\/)\/+/g, '$1') || null
        })));
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="shop-container">
      {products.map(product => (
        <div key={product.id} className="product-card">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              onError={(e) => e.target.src = '/placeholder-product.png'}
            />
          ) : (
            <div className="no-image">No Image</div>
          )}
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}