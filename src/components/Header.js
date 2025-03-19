import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ favoritesCount, unreadMessagesCount, currentUser, onLogout }) {
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!currentUser || !currentUser.name) return "U";
    
    const nameParts = currentUser.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return nameParts[0][0];
  };

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
          Messages {unreadMessagesCount > 0 && <span className="message-count">{unreadMessagesCount}</span>}
        </Link>
      </nav>
      <div className="user-profile">
        <div className="user-profile-dropdown">
          <Link to="/profile">{getUserInitials()}</Link>
          <div className="dropdown-content">
            <div className="user-info">
              <strong>{currentUser?.name}</strong>
              <span>{currentUser?.email}</span>
            </div>
            <Link to="/profile" className="dropdown-link">My Profile</Link>
            <Link to="/messages" className="dropdown-link">
              Messages
              {unreadMessagesCount > 0 && <span className="dropdown-badge">{unreadMessagesCount}</span>}
            </Link>
            <button onClick={onLogout} className="logout-button">Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;