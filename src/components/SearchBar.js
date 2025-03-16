import React from 'react';
import './SearchBar.css';

function SearchBar({ placeholder }) {
  return (
    <div className="search-bar">
      <input type="text" placeholder={placeholder} />
      <button className="search-button">
        <span role="img" aria-label="search">🔍</span>
      </button>
    </div>
  );
}

export default SearchBar;