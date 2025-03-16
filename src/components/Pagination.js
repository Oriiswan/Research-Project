import React from 'react';
import './Pagination.css';

function Pagination({ currentPage, totalPages }) {
  return (
    <div className="pagination">
      {currentPage > 1 && (
        <button className="pagination-btn prev">
          &lt;
        </button>
      )}
      
      {[...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1;
        return (
          <button 
            key={pageNumber}
            className={`pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
          >
            {pageNumber}
          </button>
        );
      })}
      
      {currentPage < totalPages && (
        <button className="pagination-btn next">
          &gt;
        </button>
      )}
    </div>
  );
}

export default Pagination;