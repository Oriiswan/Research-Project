import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';
import { useProducts } from '../context/ProductContext';

function ProductCard({ product, toggleFavorite: propToggleFavorite, isFavorite, currentUser }) {
  const { isProductFavorited, toggleFavorite: contextToggleFavorite } = useProducts();
  const { id, title, price, image, inStock, condition, seller, sellerId } = product;
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  // Check if this is the current user's product
  const isOwnProduct = currentUser && (
    String(currentUser.id) === String(sellerId) || 
    String(currentUser.id) === String(product.sellerId)
  );

  const checkIsFavorited = (id) => {
    if (isFavorite !== undefined) return isFavorite;
    return isProductFavorited(id);
  };

  // Updated favorite toggle function to not navigate
  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Use prop toggleFavorite if provided, otherwise use context's toggleFavorite
    if (propToggleFavorite) {
      propToggleFavorite(id);
    } else {
      contextToggleFavorite(id);
    }
  };
  
  const handleViewDetails = () => {
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    navigate(`/product/${id}`);
  };
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Create a new conversation object
    const newConversation = {
      id: Date.now(),
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
    console.log("Product owner check:", {
      "currentUser": currentUser,
      "product.sellerId": sellerId,
      "product.seller": seller,
      "isOwnProduct": isOwnProduct
    });
    
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
    <div 
      className={`product-card ${isOwnProduct ? 'my-product' : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isOwnProduct && (
        <div className="my-product-badge">My Listing</div>
      )}
      
      <div className="product-image" onClick={handleViewDetails}>
  <img 
    src={image || '/images/textbook.png'} 
    alt={title} 
    onError={(e) => {
      console.log("Image failed to load, falling back to default");
      e.target.src = '/images/textbook.png';
    }}
  />
  {/* Only show favorite button if it's NOT the user's own product */}
  {!isOwnProduct && (
    <button 
      className={`favorite-button ${checkIsFavorited(product.id) ? 'favorited' : ''}`}
      onClick={handleFavoriteToggle}
      aria-label={checkIsFavorited(product.id) ? 'Remove from favorites' : 'Add to favorites'}
    >
      {checkIsFavorited(product.id) ? '❤️' : '🤍'}
    </button>
  )}
</div>
      
      <div className="product-info" onClick={handleViewDetails}>
        <h3 className="product-title">{title}</h3>
        <p className="product-price">₱{price.toFixed(2)}</p>
        
        {condition && (
          <p className="product-condition">{condition}</p>
        )}
        
        {seller && (
          <p className="product-seller">
            {isOwnProduct ? 'Listed by: You' : `Seller: ${seller}`}
          </p>
        )}
        
        <div className="product-status">
          {inStock ? (
            <span className="in-stock">Available</span>
          ) : (
            <span className="out-of-stock">Out of Stock</span>
          )}
        </div>
      </div>
      
      <div className="product-actions">
  {isOwnProduct ? (
    <>
      <button 
        className="edit-btn" 
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/edit-product/${id}`);
        }}
      >
        Edit Listing
      </button>
      <button 
        className="details-btn" 
        onClick={handleViewDetails}
      >
        View Details
      </button>
    </>
  ) : (
    <>
      <button 
        className="message-btn" 
        onClick={(e) => {
          e.stopPropagation();
          setShowMessageModal(true);
        }}
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
    </>
  )}
</div>

      {/* Message Modal */}
      {showMessageModal && !isOwnProduct && (
        <div className="message-modal-overlay">
          <div className="message-modal" ref={modalRef}>
            <div className="message-modal-header">
            {!isOwnProduct && (
  <button className="message-seller-btn">Message Seller</button>
)}
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