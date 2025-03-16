import React, { useState } from 'react';
import './Filters.css';

function Filters() {
  const [filters, setFilters] = useState({
    categories: {
      textbooks: true,
      artSupplies: false,
      schoolSupplies: false,
      uniforms: false,
      electronics: false
    },
    gradeLevel: {
      grade11: false,
      grade12: true
    },
    condition: {
      brandNew: false,
      slightlyUsed: true,
      used: false
    },
    inStock: true,
    priceRange: [100, 500]
  });
  
  const handleCheckboxChange = (category, item) => {
    setFilters({
      ...filters,
      [category]: {
        ...filters[category],
        [item]: !filters[category][item]
      }
    });
  };
  
  const handleStockChange = () => {
    setFilters({
      ...filters,
      inStock: !filters.inStock
    });
  };
  
  const resetFilters = () => {
    setFilters({
      categories: {
        textbooks: false,
        artSupplies: false,
        schoolSupplies: false,
        uniforms: false,
        electronics: false
      },
      gradeLevel: {
        grade11: false,
        grade12: false
      },
      condition: {
        brandNew: false,
        slightlyUsed: false,
        used: false
      },
      inStock: false,
      priceRange: [100, 500]
    });
  };
  
  return (
    <div className="filters-container">
      <h2>Filters</h2>
      
      <div className="filter-section">
        <h3>Categories</h3>
        <div className="filter-item">
          <input 
            type="checkbox" 
            id="filter-textbooks" 
            checked={filters.categories.textbooks}
            onChange={() => handleCheckboxChange('categories', 'textbooks')}
          />
          <label htmlFor="filter-textbooks">Textbooks</label>
        </div>
        <div className="filter-item">
          <input 
            type="checkbox" 
            id="filter-artSupplies"
            checked={filters.categories.artSupplies}
            onChange={() => handleCheckboxChange('categories', 'artSupplies')}
          />
          <label htmlFor="filter-artSupplies">Art Supplies</label>
        </div>
        <div className="filter-item">
          <input 
            type="checkbox" 
            id="filter-schoolSupplies"
            checked={filters.categories.schoolSupplies}
            onChange={() => handleCheckboxChange('categories', 'schoolSupplies')}
          />
          <label htmlFor="filter-schoolSupplies">School Supplies</label>
        </div>
        <div className="filter-item">
          <input 
            type="checkbox" 
            id="filter-uniforms"
            checked={filters.categories.uniforms}
            onChange={() => handleCheckboxChange('categories', 'uniforms')}
          />
          <label htmlFor="filter-uniforms">Uniforms</label>
        </div>
        <div className="filter-item">
          <input 
            type="checkbox" 
            id="filter-electronics"
            checked={filters.categories.electronics}
            onChange={() => handleCheckboxChange('categories', 'electronics')}
          />
          <label htmlFor="filter-electronics">Electronics</label>
        </div>
      </div>
      
      <div className="filter-section">
        <h3>Grade Level</h3>
        <div className="filter-item">
          <input 
            type="checkbox" 
            id="filter-grade11"
            checked={filters.gradeLevel.grade11}
            onChange={() => handleCheckboxChange('gradeLevel', 'grade11')}
          />
          <label htmlFor="filter-grade11">Grade 11</label>
        </div>
        <div className="filter-item">
          <input 
            type="checkbox" 
            id="filter-grade12"
            checked={filters.gradeLevel.grade12}
            onChange={() => handleCheckboxChange('gradeLevel', 'grade12')}
          />
          <label htmlFor="filter-grade12">Grade 12</label>
        </div>
      </div>
      
      <div className="filter-section">
        <h3>Condition</h3>
        <div className="filter-item">
          <input 
            type="checkbox" 
            id="filter-brandNew"
            checked={filters.condition.brandNew}
            onChange={() => handleCheckboxChange('condition', 'brandNew')}
          />
          <label htmlFor="filter-brandNew">Brand New</label>
        </div>
        <div className="filter-item">
          <input 
            type="checkbox" 
            id="filter-slightlyUsed"
            checked={filters.condition.slightlyUsed}
            onChange={() => handleCheckboxChange('condition', 'slightlyUsed')}
          />
          <label htmlFor="filter-slightlyUsed">Slightly Used</label>
        </div>
        <div className="filter-item">
          <input 
            type="checkbox" 
            id="filter-used"
            checked={filters.condition.used}
            onChange={() => handleCheckboxChange('condition', 'used')}
          />
          <label htmlFor="filter-used">Used</label>
        </div>
      </div>
      
      <div className="filter-section">
        <h3>Price Range</h3>
        <div className="price-range-slider">
          <span>₱100</span>
          <input 
            type="range" 
            min="100" 
            max="500" 
            value={filters.priceRange[1]} 
            onChange={(e) => setFilters({...filters, priceRange: [100, parseInt(e.target.value)]})}
          />
          <span>₱500</span>
        </div>
      </div>
      
      <div className="filter-section">
        <h3>Availability</h3>
        <div className="filter-item">
          <input 
            type="checkbox" 
            id="filter-inStock"
            checked={filters.inStock}
            onChange={handleStockChange}
          />
          <label htmlFor="filter-inStock">In Stock Only</label>
        </div>
      </div>
      
      <button className="reset-filters-btn" onClick={resetFilters}>
        Reset Filters
      </button>
    </div>
  );
}

export default Filters;