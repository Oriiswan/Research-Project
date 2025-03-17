import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import './HomePage.css';

function HomePage() {
  const { products, toggleFavorite, isProductFavorited, currentUser } = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  
  // Get featured products from the product context
  useEffect(() => {
    if (products.length > 0) {
      // Get 3 random products that are in stock and active
      const availableProducts = products.filter(product => 
        product.status === 'active' && product.inStock === true
      );
      
      // If we have enough products, select 3 random ones
      // Otherwise use all available products
      if (availableProducts.length > 3) {
        const randomProducts = [];
        const usedIndices = new Set();
        
        while (randomProducts.length < 3 && usedIndices.size < availableProducts.length) {
          const randomIndex = Math.floor(Math.random() * availableProducts.length);
          
          if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            randomProducts.push(availableProducts[randomIndex]);
          }
        }
        
        setFeaturedProducts(randomProducts);
      } else {
        setFeaturedProducts(availableProducts);
      }
    }
  }, [products]);

  const categories = [
    { id: 1, name: 'Textbooks', icon: '📚', color: '#ff7f50' },
    { id: 2, name: 'Art', icon: '🎨', color: '#4682b4' },
    { id: 3, name: 'School Supplies', icon: '📝', color: '#9370db' },
    { id: 4, name: 'Uniforms', icon: '👕', color: '#32cd32' }
  ];
  
  return (
    <div className="home-page">
      <div className="search-container">
        <button className="categories-btn">Categories</button>
        <SearchBar placeholder="Search for products..." />
      </div>
      
      <section className="categories-section">
        <h2>Popular Categories</h2>
        <div className="categories-grid">
          {categories.map(category => (
            <Link to={`/browse?category=${category.name.toLowerCase()}`} key={category.id} className="category-card">
              <div className="category-icon" style={{ backgroundColor: category.color }}>
                <span>{category.icon}</span>
              </div>
              <h3>{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>
      
      <section className="featured-section">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {featuredProducts.length > 0 ? (
            featuredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                toggleFavorite={toggleFavorite}
                isFavorite={isProductFavorited(product.id)}
                currentUser={currentUser}
              />
            ))
          ) : (
            <p>Loading featured products...</p>
          )}
        </div>
        <div className="view-all-container">
          <Link to="/browse" className="view-all-btn">View All Products</Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;