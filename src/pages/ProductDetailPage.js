import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import './ProductDetailPage.css';

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    products, 
    currentUser, 
    updateProductStatus, 
    deleteProduct 
  } = useProducts();
  const [message, setMessage] = useState('');
  
  // Find the product with the matching ID
  const product = products.find(p => p.id === parseInt(id) || p.id === id);
  
  // If product not found, show error
  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="product-not-found">
          <h2>Product Not Found</h2>
          <p>The product you are looking for does not exist or has been removed.</p>
          <button onClick={() => navigate('/')}>Return to Browse</button>
        </div>
      </div>
    );
  }
  
  // Check if this is the current user's product
  const isOwnProduct = currentUser && currentUser.id === product.sellerId;

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Here you would typically send the message or store it
    console.log("Message sent:", message);
    setMessage('');
    
    // You could navigate to messages page or show a success notification
    alert("Message sent successfully!");
  };
  
  const handleToggleAvailability = () => {
    // Update the product status in context
    updateProductStatus(id, product.inStock ? 'sold' : 'active');
    // Navigate back to profile page after update
    navigate('/profile');
  };

  const handleDeleteListing = () => {
    // Delete the product in context
    deleteProduct(id);
    // Navigate back to profile
    navigate('/profile');
  };

  const handleBack = () => {
    navigate(-1);
  };
  
  const handleEditListing = () => {
    navigate(`/edit-product/${id}`);
  };
  
  return (
    <div className={`product-detail-page ${isOwnProduct ? 'my-product-detail' : ''}`}>
      <div className="product-detail-container">  
        <div className="product-detail-navigation">
          <a href="#" className="back-link" onClick={handleBack}>
            &larr; Back to Browse
          </a>
        </div>
        
        {isOwnProduct && (
          <div className="owner-banner">
            <div className="owner-badge">Your Listing</div>
            <p>You are viewing your own listing. Other users see this as a regular product.</p>
          </div>
        )}
        
        <div className="product-detail-content">
          <div className="product-detail-image">
            <img src={product.image} alt={product.title} />
          </div>
          
          <div className="product-detail-info">
            <h1>{product.title}</h1>
            <div className="product-price-tag">
              ₱{product.price}
              {product.originalPrice && (
                <span className="original-price"> ₱{product.originalPrice}</span>
              )}
              {product.isNegotiable && (
                <span className="negotiable-badge">Negotiable</span>
              )}
            </div>
            
            <div className="product-meta">
              <div className="meta-item">
                <div className="meta-label">Condition:</div>
                <div className="meta-value">{product.condition}</div>
              </div>
              {product.category && (
                <div className="meta-item">
                  <div className="meta-label">Category:</div>
                  <div className="meta-value">{product.category}</div>
                </div>
              )}
              {product.subcategory && (
                <div className="meta-item">
                  <div className="meta-label">Subcategory:</div>
                  <div className="meta-value">{product.subcategory}</div>
                </div>
              )}
              {product.gradeLevel && (
                <div className="meta-item">
                  <div className="meta-label">Grade Level:</div>
                  <div className="meta-value">{product.gradeLevel}</div>
                </div>
              )}
              <div className="meta-item">
                <div className="meta-label">Availability:</div>
                <div className="meta-value">
                  {product.inStock ? (
                    <span className="in-stock">In Stock</span>
                  ) : (
                    <span className="out-of-stock">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description || "No description provided."}</p>
            </div>
            
            <div className="seller-info">
              <h3>{isOwnProduct ? 'Your Seller Information' : 'Seller Information'}</h3>
              <div className="seller-profile">
                <div className="seller-avatar">
                  {product.seller.charAt(0)}
                </div>
                <div className="seller-details">
                  <h4>{isOwnProduct ? `${product.seller} (You)` : product.seller}</h4>
                  <p>Member since {product.memberSince || "2023"}</p>
                </div>
              </div>
              
              {product.contactPreferences && (
                <div className="contact-preferences">
                  <h4>Contact Preferences:</h4>
                  <ul>
                    {product.contactPreferences.inAppMessaging && (
                      <li>In-app messaging</li>
                    )}
                    {product.contactPreferences.phoneCall && (
                      <li>Phone call</li>
                    )}
                    {product.contactPreferences.sms && (
                      <li>SMS</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            
            {isOwnProduct ? (
              <div className="owner-actions">
                
                <button 
                  className="toggle-availability-btn"
                  onClick={handleToggleAvailability}
                >
                  {product.inStock ? 'Mark as Sold' : 'Mark as Available'}
                </button>
                <button 
                  className="delete-listing-btn"
                  onClick={handleDeleteListing}
                >
                  Delete Listing
                </button>
              </div>
            ) : (
              <div className="message-section">
                <h3>Send a Message to the Seller</h3>
                <div className="message-form">
                  <textarea 
                    placeholder="Type your message here..." 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                  <button 
                    className="send-message-btn" 
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    Send Message
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;