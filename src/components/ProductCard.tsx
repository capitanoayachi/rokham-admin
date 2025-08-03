// src/components/ProductCard.tsx
import React from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url?: string | null;
};

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const cleanImageUrl = product.image_url
    ? product.image_url.replace('product-images//', 'product-images/')
    : null;

  return (
    <div className="border rounded-lg p-4 w-64 shadow-sm">
      <div className="h-40 mb-2 overflow-hidden rounded">
        {cleanImageUrl ? (
          <img
            src={cleanImageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/fallback.png';
            }}
          />
        ) : (
          <div className="bg-gray-100 w-full h-full flex items-center justify-center text-xs text-gray-500">
            لا توجد صورة
          </div>
        )}
      </div>
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-sm text-gray-700">{product.description}</p>
      <div className="mt-2 font-bold">{product.price.toFixed(2)} DH</div>
    </div>
  );
}
