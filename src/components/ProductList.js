
import React from 'react';
import ProductCard from './ProductCard';
import './ProductList.css'; // Make sure this CSS file exists in the same directory

const ProductList = ({ products, toggleFavorite, isProductFavorited }) => {
  return (
    <div className="product-list">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          toggleFavorite={toggleFavorite}
          isProductFavorited={isProductFavorited}
        />
      ))}
    </div>
  );
};

export default ProductList;