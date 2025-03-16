import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import './FavoritePage.css';

function FavoritePage() {
  const { products, favorites, toggleFavorite, isProductFavorited } = useProducts();
  const [sortMethod, setSortMethod] = useState('date-added');
  
  // Sort favorites based on selected method
  
  const sortedFavorites = [...favorites].sort((a, b) => {
    if (sortMethod === 'price-low') return a.price - b.price;
    if (sortMethod === 'price-high') return b.price - a.price;
    if (sortMethod === 'date-added') return b.dateAdded - a.dateAdded;
    return 0;
  });

  const handleFavoriteToggle = (productId) => {
    toggleFavorite(productId);
    // We don't navigate away since we're already on the favorites page
  };

  return (
    <div className="favorite-page">
      <h1>Saved Items</h1>
      
      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <div className="empty-icon">❤️</div>
          <h2>Your Saved Items List is Empty</h2>
          <p>Products you save will appear here for easy access when you're ready to buy</p>
          <Link to="/browse" className="browse-btn">Browse Products</Link>
        </div>
      ) : (
        <div className="favorites-content">
          <div className="favorites-header">
            <h2>Saved Items ({favorites.length})</h2>
            <div className="sort-section">
              <span>Sort by:</span>
              <select 
                value={sortMethod}
                onChange={(e) => setSortMethod(e.target.value)}
                className="sort-dropdown"
              >
                <option value="date-added">Date Added</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
          
          <div className="favorites-grid">
            {sortedFavorites.map(product => (
              <div key={product.id} className="favorite-item">
                <ProductCard 
                  product={product} 
                  toggleFavorite={handleFavoriteToggle}
                  isProductFavorited={isProductFavorited}
                  showMessageButton={true}
                  isFavorite={true}
                />
                <button 
                  className="remove-favorite-btn"
                  onClick={() => toggleFavorite(product.id)}
                >
                  Remove from Saved Items
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    
  );
}

export default FavoritePage;