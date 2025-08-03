import React from 'react';

export default function ProductCard({ product }) {
  // تنظيف أي "//" زائد في المسار
  const cleanImageUrl = product.image_url
    ? product.image_url.replace('product-images//', 'product-images/')
    : null;

  // طباعة للتشخيص
  console.log('Rendering product card:', product.name, 'image_url:', product.image_url, 'clean:', cleanImageUrl);

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: 8,
      padding: 12,
      width: 220,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }}>
      <div style={{ height: 140, marginBottom: 8, background: '#f5f5f5', overflow: 'hidden', borderRadius: 6 }}>
        {cleanImageUrl ? (
          <img
            src={cleanImageUrl}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              console.warn('Image failed to load, showing fallback:', cleanImageUrl);
              e.currentTarget.src = '/fallback.png';
            }}
          />
        ) : (
          <div style={{
            padding: 16,
            textAlign: 'center',
            color: '#666',
            fontSize: 12,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            لا توجد صورة
          </div>
        )}
      </div>
      <h3 style={{ margin: '4px 0' }}>{product.name}</h3>
      <p style={{ margin: '4px 0', fontSize: 12 }}>{product.description}</p>
      <div style={{ fontWeight: 'bold' }}>
        {product.price ? `${parseFloat(product.price).toFixed(2)} DH` : '—'}
      </div>
    </div>
  );
}
