import React from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';
import { useProducts } from '../context/ProductContext'; // Add this import

const ProductList = ({ products, toggleFavorite, isProductFavorited }) => {
  const { currentUser } = useProducts(); // Get the current user from context
  
  return (
    <div className="product-list">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          toggleFavorite={toggleFavorite}
          isFavorite={isProductFavorited(product.id)}
          currentUser={currentUser} // Pass the current user to the ProductCard
        />
      ))}
    </div>
  );
};

export default ProductList;