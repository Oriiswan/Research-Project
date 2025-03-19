import React, { useState, useEffect, useRef } from 'react';
import './MessagePage.css';

function MessagePage({ currentUser, onConversationsUpdate }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'buying', 'selling'
  const messagesEndRef = useRef(null);

  // Update the parent component whenever conversations change
  useEffect(() => {
    if (conversations.length > 0 && onConversationsUpdate) {
      onConversationsUpdate(conversations);
    }
  }, [conversations, onConversationsUpdate]);

  // Load conversations from localStorage or API
  useEffect(() => {
    // First check localStorage for messages created from ProductCard
    const storedConversations = JSON.parse(localStorage.getItem('conversations')) || [];
    
    // Get all users to access their avatars
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Mock data for development with correct image paths
    const mockConversations = [
      {
        id: 1,
        product: {
          id: 101,
          title: "Student Artwork",
          image: "/images/artwork.png",
          price: 500
        },
        participants: {
          seller: { id: 201, name: "John Seller", avatar: "/images/profile1.jpg" },
          buyer: { id: 301, name: "Maria Buyer" }
        },
        lastMessage: {
          text: "Is this still available?",
          timestamp: new Date(2025, 2, 15, 14, 30),
          senderId: 301
        },
        unread: true,
        messages: [
          {
            id: 1001,
            senderId: 301,
            text: "Is this still available?",
            timestamp: new Date(2025, 2, 15, 14, 30)
          }
        ]
      },
      {
        id: 2,
        product: {
          id: 102,
          title: "Calculator",
          image: "/images/calculator.png",
          price: 80000
        },
        participants: {
          seller: { id: 202, name: "Alex Tech", avatar: "/images/profile2.jpg" },
          buyer: { id: 301, name: "Maria Buyer" }
        },
        lastMessage: {
          text: "Can you do 75000?",
          timestamp: new Date(2025, 2, 14, 9, 45),
          senderId: 301
        },
        unread: false,
        messages: [
          // Your existing messages
        ]
      },
      {
        id: 3,
        product: {
          id: 103,
          title: "Computer Science Textbook",
          image: "/images/textbook.png",
          price: 1200
        },
        participants: {
          seller: { id: 301, name: "Maria Buyer" },
          buyer: { id: 203, name: "David Student", avatar: "/images/profile3.jpg" }
        },
        lastMessage: {
          text: "I'm interested in your textbook, is it the latest edition?",
          timestamp: new Date(2025, 2, 16, 10, 15),
          senderId: 203
        },
        unread: true,
        messages: [
          // Your existing messages
        ]
      }
    ];
    
    let conversationsData = storedConversations.length === 0 ? mockConversations : storedConversations;
    
    // Filter conversations to only include those where currentUser is a participant
    conversationsData = conversationsData.filter(conv => 
      conv.participants.seller.id === currentUser.id || 
      conv.participants.buyer.id === currentUser.id
    );
    
    // Format dates properly and ensure avatar consistency
    const formattedConversations = conversationsData.map(conv => {
      // Find seller and buyer users in the users array to get correct avatars
      const sellerUser = users.find(user => user.id === conv.participants.seller.id) || {};
      const buyerUser = users.find(user => user.id === conv.participants.buyer.id) || {};
      
      return {
        ...conv,
        lastMessage: {
          ...conv.lastMessage,
          timestamp: new Date(conv.lastMessage.timestamp)
        },
        messages: conv.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        // Ensure product has proper image path
        product: {
          ...conv.product,
          image: conv.product.image || getDefaultProductImage(conv.product.title)
        },
        // Use the avatar from the user profiles when available
        participants: {
          ...conv.participants,
          seller: {
            ...conv.participants.seller,
            avatar: sellerUser.avatar || conv.participants.seller.avatar || "/images/default-avatar.png"
          },
          buyer: {
            ...conv.participants.buyer,
            avatar: buyerUser.avatar || conv.participants.buyer.avatar || "/images/default-avatar.png"
          }
        }
      };
    });
    
    setConversations(formattedConversations);
    
    // Helper function to assign default product images based on product title
    function getDefaultProductImage(title) {
      if (title.toLowerCase().includes("artwork")) return "/images/artwork.png";
      if (title.toLowerCase().includes("macbook") || title.toLowerCase().includes("pro")) return "/images/power.png";
      if (title.toLowerCase().includes("textbook")) return "/images/textbook.png";
      if (title.toLowerCase().includes("calculator")) return "/images/calculator.png";
      return "/images/perfume.png"; // default fallback
    }
  }, [currentUser.id]); // Added currentUser.id as a dependency

  // Rest of the component remains the same
  // ...

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation?.messages]);

  // When selecting a conversation, mark it as read
  const handleSelectConversation = (conversation) => {
    if (conversation.unread) {
      // Create a copy with unread set to false
      const updatedConversation = { ...conversation, unread: false };
      
      // Update the conversations array
      const updatedConversations = conversations.map(conv => 
        conv.id === conversation.id ? updatedConversation : conv
      );
      
      setConversations(updatedConversations);
      setSelectedConversation(updatedConversation);
      
      // Save to localStorage
      localStorage.setItem('conversations', JSON.stringify(updatedConversations));
      
      // Call the onConversationsUpdate callback to update unread count in header
      if (onConversationsUpdate) {
        onConversationsUpdate(updatedConversations);
      }
    } else {
      setSelectedConversation(conversation);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    
    // Create new message object
    const message = {
      id: Date.now(), // Temporary ID
      senderId: currentUser.id,
      text: newMessage,
      timestamp: new Date()
    };
    
    // Add to current conversation
    const updatedConversation = {
      ...selectedConversation,
      messages: [...(selectedConversation.messages || []), message],
      lastMessage: {
        text: newMessage,
        timestamp: new Date(),
        senderId: currentUser.id
      }
    };
    
    // Update conversations list
    const updatedConversations = conversations.map(conv => 
      conv.id === selectedConversation.id ? updatedConversation : conv
    );
    
    setConversations(updatedConversations);
    setSelectedConversation(updatedConversation);
    
    // When updating localStorage, need to update ALL conversations, not just the user's
    const allStoredConversations = JSON.parse(localStorage.getItem('conversations')) || [];
    const updatedStoredConversations = allStoredConversations.map(conv => 
      conv.id === selectedConversation.id ? updatedConversation : conv
    );
    localStorage.setItem('conversations', JSON.stringify(updatedStoredConversations));
    
    // Reset input
    setNewMessage('');
    
    // In a real app, send to API
    console.log("Sending message:", message);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const isCurrentUserSeller = (conversation) => {
    return currentUser && currentUser.id === conversation.participants.seller.id;
  };

  const getOtherParticipant = (conversation) => {
    return isCurrentUserSeller(conversation) 
      ? conversation.participants.buyer 
      : conversation.participants.seller;
  };

  // Filter conversations based on activeTab and searchTerm
  const filteredConversations = conversations.filter(conv => {
    // First filter by tab
    if (activeTab === 'buying' && isCurrentUserSeller(conv)) {
      return false;
    }
    if (activeTab === 'selling' && !isCurrentUserSeller(conv)) {
      return false;
    }
    
    // Then filter by search term
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      conv.product.title.toLowerCase().includes(searchLower) ||
      conv.participants.seller.name.toLowerCase().includes(searchLower) ||
      conv.participants.buyer.name.toLowerCase().includes(searchLower) ||
      (conv.lastMessage.text && conv.lastMessage.text.toLowerCase().includes(searchLower))
    );
  });

  // Create initials from name for avatar placeholder
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="message-page">
      <div className="sidebar">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Messages
          </button>
          <button 
            className={`tab ${activeTab === 'buying' ? 'active' : ''}`}
            onClick={() => setActiveTab('buying')}
          >
            Buying
          </button>
          <button 
            className={`tab ${activeTab === 'selling' ? 'active' : ''}`}
            onClick={() => setActiveTab('selling')}
          >
            Selling
          </button>
        </div>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="conversations-list">
          {filteredConversations.length === 0 ? (
            <div className="no-conversations">
              {searchTerm ? "No conversations match your search" : "No conversations found"}
            </div>
          ) : (
            filteredConversations.map(conversation => (
              <div
                key={conversation.id}
                className={`conversation-item ${selectedConversation?.id === conversation.id ? 'selected' : ''} ${conversation.unread ? 'unread' : ''}`}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="conversation-image">
                  {conversation.product.image ? (
                    <img src={conversation.product.image} alt={conversation.product.title} />
                  ) : (
                    <div className="placeholder-image">{conversation.product.title.substring(0, 1)}</div>
                  )}
                </div>
                <div className="conversation-info">
                  <div className="conversation-header">
                    <h4>{conversation.product.title}</h4>
                    <span className="timestamp">{formatDate(conversation.lastMessage.timestamp)}</span>
                  </div>
                  <div className="conversation-participant">
                    <span className={isCurrentUserSeller(conversation) ? 'buyer-badge' : 'seller-badge'}>
                      {isCurrentUserSeller(conversation) ? 'Buyer: ' : 'Seller: '}
                    </span>
                    {getOtherParticipant(conversation).name}
                  </div>
                  <div className="conversation-preview">
                    {conversation.lastMessage.senderId === currentUser.id ? 'You: ' : ''}
                    {conversation.lastMessage.text}
                  </div>
                </div>
                {conversation.unread && <div className="unread-indicator"></div>}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="message-container">
        {!selectedConversation ? (
          <div className="no-conversation-selected">
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h3>Your Messages</h3>
              <p>Select a conversation to view your messages</p>
            </div>
          </div>
        ) : (
          <>
            <div className="message-header">
              <div className="product-info">
                {selectedConversation.product.image ? (
                  <img src={selectedConversation.product.image} alt={selectedConversation.product.title} />
                ) : (
                  <div className="placeholder-image">{selectedConversation.product.title.substring(0, 1)}</div>
                )}
                <div>
                  <h3>{selectedConversation.product.title}</h3>
                  <p>₱{selectedConversation.product.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="participant-info">
                <div className="avatar">
                  {getOtherParticipant(selectedConversation).avatar ? (
                    <img 
                      src={getOtherParticipant(selectedConversation).avatar} 
                      alt={getOtherParticipant(selectedConversation).name} 
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {getInitials(getOtherParticipant(selectedConversation).name)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="participant-role">
                    {isCurrentUserSeller(selectedConversation) ? 'Buyer' : 'Seller'}
                  </p>
                  <p className="participant-name">
                    {getOtherParticipant(selectedConversation).name}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="messages-list">
              {selectedConversation.messages && selectedConversation.messages.map(message => (
                <div 
                  key={message.id} 
                  className={`message ${message.senderId === currentUser.id ? 'outgoing' : 'incoming'}`}
                >
                  <div className="message-bubble">
                    <p>{message.text}</p>
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} /> {/* Empty div for scroll reference */}
            </div>
            
            <form className="message-input" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim()} 
                className={!newMessage.trim() ? 'disabled' : ''}
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default MessagePage;