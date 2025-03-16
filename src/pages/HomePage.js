import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

function HomePage({ toggleFavorite, isProductFavorited }) {
  const categories = [
    { id: 1, name: 'Textbooks', icon: '📚', color: '#ff7f50' },
    { id: 2, name: 'Art', icon: '🎨', color: '#4682b4' },
    { id: 3, name: 'School Supplies', icon: '📝', color: '#9370db' },
    { id: 4, name: 'Uniforms', icon: '👕', color: '#32cd32' }
  ];
  
  const featuredProducts = [
    {
      id: 1, 
      title: 'SHS Math Textbook', 
      price: 350, 
      image: '/images/textbook.png',
      inStock: true
    },
    {
      id: 2, 
      title: 'Student Artwork', 
      price: 500, 
      image: '/images/artwork.png',
      inStock: true
    },
    {
      id: 3, 
      title: 'Calculator Set', 
      price: 250, 
      image: '/images/calculator.png',
      inStock: false
    }
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
          {featuredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              toggleFavorite={toggleFavorite}
              isFavorited={isProductFavorited(product.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;