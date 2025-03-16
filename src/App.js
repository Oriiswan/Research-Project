import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import SellPage from './pages/SellPage';
import FavoritesPage from './pages/FavoritePage';
import ProductDetailPage from './pages/ProductDetailPage';
import MessagePage from './pages/MessagePage';
import ProfilePage from './pages/ProfilePage';
import Footer from './components/Footer';
import './App.css';
import { ProductProvider } from './context/ProductContext';

function App() {
  const [favorites, setFavorites] = useState([]);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  
  // Mock current user for demonstration
  const [currentUser] = useState({
    id: 301,
    name: "Maria Buyer",
    email: "maria@example.com",
    phone: "555-123-4567",
    bio: "Senior at FCU, majoring in Computer Science. I love finding affordable textbooks and lab equipment!",
    location: "FCU Campus, Building C",
    avatar: "" // Empty string will trigger the avatar placeholder with initials
  });
  
  // Check for new messages
  useEffect(() => {
    const checkForNewMessages = () => {
      const storedConversations = JSON.parse(localStorage.getItem('conversations')) || [];
      const hasUnread = storedConversations.some(conv => conv.unread);
      setHasNewMessages(hasUnread);
    };
    
    // Initial check
    checkForNewMessages();
    
    // Set up interval to check periodically
    const interval = setInterval(checkForNewMessages, 30000);
    
    // Clean up on unmount
    return () => clearInterval(interval);
  }, []);
  
  const toggleFavorite = (product) => {
    // Check if the product is already in favorites
    const isProductInFavorites = favorites.some(item => item.id === product.id);
    
    if (isProductInFavorites) {
      // Remove from favorites
      setFavorites(favorites.filter(item => item.id !== product.id));
    } else {
      // Add to favorites
      setFavorites([...favorites, product]);
    }
  };
  
  const isProductFavorited = (productId) => {
    return favorites.some(item => item.id === productId);
  };
  
  return (
    <ProductProvider>
    <Router>
      <div className="app">
        <Header favoritesCount={favorites.length} hasNewMessages={hasNewMessages} />
        <div className="content">
          <Routes>
            <Route path="/" element={
              <HomePage 
                toggleFavorite={toggleFavorite} 
                isProductFavorited={isProductFavorited}
                currentUser={currentUser}
              />
            } />
            <Route path="/browse" element={
              <BrowsePage 
                toggleFavorite={toggleFavorite} 
                isProductFavorited={isProductFavorited}
                currentUser={currentUser}
              />
            } />
            <Route path="/sell" element={<SellPage currentUser={currentUser} />} />
            <Route path="/favorites" element={
              <FavoritesPage 
                favorites={favorites} 
                toggleFavorite={toggleFavorite}
                currentUser={currentUser}
              />
            } />
            <Route path="/product/:id" element={
              <ProductDetailPage 
                currentUser={currentUser}
                toggleFavorite={toggleFavorite}
                isProductFavorited={isProductFavorited}
              />
            } />
            <Route path="/messages" element={<MessagePage currentUser={currentUser} />} />
            <Route path="/profile" element={<ProfilePage currentUser={currentUser} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
    </ProductProvider>
  );
}

export default App;