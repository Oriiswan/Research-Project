import React, { useState, useEffect } from 'react';
 
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import ProductList from '../components/ProductList';
import Pagination from '../components/Pagination';
import { useProducts } from '../context/ProductContext';
import './BrowsePage.css';

function BrowsePage() {
  const { products, toggleFavorite, isProductFavorited } = useProducts();

  const [sortMethod, setSortMethod] = useState('price-low');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    gradeLevel: '',
    condition: '',
    priceRange: { min: 0, max: 1000 }
  });
  
  const productsPerPage = 8;
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...products].filter(product => 
      // Only show active (not sold) products
      product.status === 'active' &&
      // Search term
      (searchTerm === '' || 
       product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
       product.subcategory.toLowerCase().includes(searchTerm.toLowerCase())) &&
      // Category filter
      (activeFilters.category === '' || product.category === activeFilters.category) &&
      // Grade level filter
      (activeFilters.gradeLevel === '' || product.gradeLevel === activeFilters.gradeLevel) &&
      // Condition filter
      (activeFilters.condition === '' || product.condition === activeFilters.condition) &&
      // Price range filter
      (product.price >= activeFilters.priceRange.min && product.price <= activeFilters.priceRange.max)
    );
    
    // Apply sorting
    switch (sortMethod) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => b.id - a.id);
        break;
      case 'oldest':
        result.sort((a, b) => a.id - b.id);
        break;
      default:
        break;
    }
    
    setFilteredProducts(result);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [products, sortMethod, searchTerm, activeFilters]);
  
  // Get current page products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  
  const handleFavoriteToggle = (productId) => {
    toggleFavorite(productId);
   
  };
  
  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  return (
    <div className="browse-page">
      <div className="search-bar-container">
        <SearchBar 
          placeholder="Search for textbooks, art supplies, uniforms..." 
          onSearch={handleSearch}
        />
      </div>
      
      <div className="browse-content">
        <Filters onFilterChange={handleFilterChange} />
        
        <div className="products-section">
          <div className="products-header">
            <h2>{activeFilters.category || 'All Products'} ({filteredProducts.length})</h2>
            <div className="sort-section">
              <span>Sort by:</span>
              <select 
                value={sortMethod}
                onChange={(e) => setSortMethod(e.target.value)}
                className="sort-dropdown"
              >
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
          
          {currentProducts.length > 0 ? (
            <ProductList 
              products={currentProducts} 
              toggleFavorite={handleFavoriteToggle}
              isProductFavorited={isProductFavorited}
            />
          ) : (
            <div className="no-products">
              <p>No products found matching your criteria.</p>
            </div>
          )}
          
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default BrowsePage;