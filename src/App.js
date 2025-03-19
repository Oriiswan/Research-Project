import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import SellPage from './pages/SellPage';
import FavoritesPage from './pages/FavoritePage';
import ProductDetailPage from './pages/ProductDetailPage';
import MessagePage from './pages/MessagePage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import Footer from './components/Footer';
import './App.css';
import { ProductProvider, useProducts } from './context/ProductContext';

// Create a new context for authentication
import { createContext, useContext } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    // Check if user info is stored in localStorage
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function AppContent() {
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const { favorites, toggleFavorite, isProductFavorited } = useProducts();
  const { currentUser, login, logout } = useAuth();
  
  // Function to calculate unread messages
  const updateUnreadMessagesCount = (conversations) => {
    if (!conversations) return;
    const count = conversations.filter(conv => conv.unread).length;
    setUnreadMessagesCount(count);
  };

  // Check for new messages
  useEffect(() => {
    if (!currentUser) return;
    
    // Initial check
    const storedConversations = JSON.parse(localStorage.getItem('conversations')) || [];
    updateUnreadMessagesCount(storedConversations);
    
    // No need for interval since we'll update via MessagePage
  }, [currentUser]);
  
  // Handler for MessagePage to update unread counts
  const handleMessagesUpdate = (updatedConversations) => {
    updateUnreadMessagesCount(updatedConversations);
  };
  
  return (
    <Router>
      <div className="app">
        {currentUser && (
          <Header 
            favoritesCount={favorites.length} 
            unreadMessagesCount={unreadMessagesCount} 
            currentUser={currentUser}
            onLogout={logout}
          />
        )}
        <div className="content">
          <Routes>
            <Route path="/login" element={
              currentUser ? <Navigate to="/" /> : <LoginPage onLogin={login} />
            } />
            
            <Route path="/" element={
              <ProtectedRoute>
                <HomePage 
                  toggleFavorite={toggleFavorite} 
                  isProductFavorited={isProductFavorited}
                  currentUser={currentUser}
                />
              </ProtectedRoute>
            } />
            
            <Route path="/browse" element={
              <ProtectedRoute>
                <BrowsePage 
                  toggleFavorite={toggleFavorite} 
                  isProductFavorited={isProductFavorited}
                  currentUser={currentUser}
                />
              </ProtectedRoute>
            } />
            
            <Route path="/sell" element={
              <ProtectedRoute>
                <SellPage currentUser={currentUser} />
              </ProtectedRoute>
            } />
            
            <Route path="/favorites" element={
              <ProtectedRoute>
                <FavoritesPage 
                  favorites={favorites} 
                  toggleFavorite={toggleFavorite}
                  currentUser={currentUser}
                />
              </ProtectedRoute>
            } />
            
            <Route path="/product/:id" element={
              <ProtectedRoute>
                <ProductDetailPage 
                  currentUser={currentUser}
                  toggleFavorite={toggleFavorite}
                  isProductFavorited={isProductFavorited}
                />
              </ProtectedRoute>
            } />
            
            <Route path="/messages" element={
              <ProtectedRoute>
                <MessagePage 
                  currentUser={currentUser}
                  onConversationsUpdate={handleMessagesUpdate}
                />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage currentUser={currentUser} />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
        {currentUser && <Footer />}
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <AppContent />
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;