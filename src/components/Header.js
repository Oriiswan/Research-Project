import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ favoritesCount }) {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">FCU SHS MARKETPLACE</Link>
      </div>
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/browse" className="nav-link browse">Browse</Link>
        <Link to="/sell" className="nav-link sell">Sell</Link>
        <Link to="/favorites" className="nav-link favorites">
        
          <img src='/images/favourite.png' alt='favourite'></img> {favoritesCount > 0 && <span className="favorites-count">{favoritesCount}</span>}
          
        </Link>
        <Link to="/messages" className="nav-link messages">
          Messages
        </Link>
      </nav>
      <div className="user-profile">
        <Link to="/profile">MB</Link>
      </div>
    </header>
  );
}

export default Header;