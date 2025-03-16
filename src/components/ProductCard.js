import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';
import { useProducts } from '../context/ProductContext'; // Add this import

function ProductCard({ product, toggleFavorite, isFavorite, currentUser }) {
  const { isProductFavorited: contextIsProductFavorited, addToFavoritesAndNavigate } = useProducts();
  const { id, title, price, image, inStock, condition, seller, sellerId } = product;
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const checkIsFavorited = (id) => {
    if (isFavorite !== undefined) return isFavorite;
    return contextIsProductFavorited(id);
  };
  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Use the context function to add to favorites and navigate
    addToFavoritesAndNavigate(product.id, navigate);
  };
  
  const handleViewDetails = () => {
    // Store the current product in localStorage
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    // Navigate to the detail page
    navigate(`/product/${id}`);
  };
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Create a new conversation object
    const newConversation = {
      id: Date.now(), // In a real app, this would come from the backend
      product: {
        id: id,
        title: title,
        image: image,
        price: price
      },
      participants: {
        seller: { id: sellerId, name: seller },
        buyer: { id: currentUser.id, name: currentUser.name }
      },
      messages: [
        {
          id: Date.now(),
          senderId: currentUser.id,
          text: message,
          timestamp: new Date()
        }
      ],
      lastMessage: {
        text: message,
        timestamp: new Date(),
        senderId: currentUser.id
      },
      unread: false
    };
    
    // Store the conversation in localStorage
    const existingConversations = JSON.parse(localStorage.getItem('conversations')) || [];
    
    // Check if conversation for this product already exists
    const existingConvIndex = existingConversations.findIndex(
      conv => conv.product.id === id && 
      conv.participants.buyer.id === currentUser.id &&
      conv.participants.seller.id === sellerId
    );
    
    if (existingConvIndex >= 0) {
      // Add to existing conversation
      const updatedConversation = {
        ...existingConversations[existingConvIndex],
        messages: [
          ...existingConversations[existingConvIndex].messages,
          {
            id: Date.now(),
            senderId: currentUser.id,
            text: message,
            timestamp: new Date()
          }
        ],
        lastMessage: {
          text: message,
          timestamp: new Date(),
          senderId: currentUser.id
        }
      };
      
      existingConversations[existingConvIndex] = updatedConversation;
    } else {
      // Add new conversation
      existingConversations.push(newConversation);
    }
    
    localStorage.setItem('conversations', JSON.stringify(existingConversations));
    
    setMessage('');
    setShowMessageModal(false);
    
    // Navigate to the messages page
    navigate('/messages');
  };

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowMessageModal(false);
      }
    }

    // Add event listener if modal is shown
    if (showMessageModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMessageModal]);

  return (
    <div className="product-card">
      <div className="product-image">
  {console.log("Rendering product image:", image)}
  <img 
    src={image || '/images/textbook.png'} 
    alt={title} 
    onError={(e) => {
      console.log("Image failed to load, falling back to default");
      e.target.src = '/images/textbook.png';
    }}
  />
  <button 
        className={`favorite-button ${checkIsFavorited(product.id) ? 'favorited' : ''}`}
        onClick= {handleFavoriteToggle}
      >
        {checkIsFavorited(product.id) ? '❤️' : '🤍'}
      </button>
</div>
      
      <div className="product-info">
        <h3 className="product-title">{title}</h3>
        <p className="product-price">₱{price.toFixed(2)}</p>
        
        {condition && (
          <p className="product-condition">{condition}</p>
        )}
        
        {seller && (
          <p className="product-seller">Seller: {seller}</p>
        )}
        
        <div className="product-status">
          {inStock ? (
            <span className="in-stock">In Stock</span>
          ) : (
            <span className="out-of-stock">Out of Stock</span>
          )}
        </div>
      </div>
      
      <div className="product-actions">
        <button 
          className="message-btn" 
          onClick={() => setShowMessageModal(true)}
          disabled={!inStock}
        >
          Message Seller
        </button>
        <button 
          className="details-btn" 
          onClick={handleViewDetails}
        >
          Details
        </button>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="message-modal-overlay">
          <div className="message-modal" ref={modalRef}>
            <div className="message-modal-header">
              <h3>Message to {seller}</h3>
              <button 
                className="close-modal-btn"
                onClick={() => setShowMessageModal(false)}
              >
                ×
              </button>
            </div>
            <div className="message-modal-content">
              <p>About: {title}</p>
              <textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              <div className="message-modal-actions">
                <button onClick={() => setShowMessageModal(false)}>Cancel</button>
                <button onClick={handleSendMessage} disabled={!message.trim()}>
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductCard;