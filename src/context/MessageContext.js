import React, { createContext, useState, useContext, useEffect } from 'react';
import { useProducts } from './ProductContext';

// Create context
export const MessageContext = createContext();

// Custom hook to use the message context
export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};

// Create provider component
export const MessageProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [listeners, setListeners] = useState([]);
  const { currentUser } = useProducts();

  // Load conversations from localStorage on mount
  useEffect(() => {
    const storedConversations = localStorage.getItem('conversations');
    if (storedConversations) {
      try {
        const parsedConversations = JSON.parse(storedConversations);
        
        // Format dates properly as they come as strings from localStorage
        const formattedConversations = parsedConversations.map(conv => ({
          ...conv,
          lastMessage: {
            ...conv.lastMessage,
            timestamp: new Date(conv.lastMessage.timestamp)
          },
          messages: (conv.messages || []).map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        
        setConversations(formattedConversations);
      } catch (error) {
        console.error("Error parsing conversations from localStorage:", error);
        setConversations([]);
      }
    } else {
      setConversations([]);
    }
    
    // Set up localStorage event listener for cross-tab communication
    const handleStorageChange = (event) => {
      if (event.key === 'conversations') {
        try {
          const updatedConversations = JSON.parse(event.newValue);
          
          // Format dates properly
          const formattedConversations = updatedConversations.map(conv => ({
            ...conv,
            lastMessage: {
              ...conv.lastMessage,
              timestamp: new Date(conv.lastMessage.timestamp)
            },
            messages: (conv.messages || []).map(msg => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          }));
          
          setConversations(formattedConversations);
          
          // Notify any listeners about the update
          listeners.forEach(listener => listener(formattedConversations));
        } catch (error) {
          console.error("Error parsing updated conversations:", error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.addEventListener('storage', handleStorageChange);
    };
  }, [listeners]);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Create a new conversation
  const createConversation = (product, sellerUser, buyerUser) => {
    const existingConversation = conversations.find(conv => 
      conv.product.id === product.id && 
      ((conv.participants.seller.id === sellerUser.id && conv.participants.buyer.id === buyerUser.id) ||
       (conv.participants.seller.id === buyerUser.id && conv.participants.buyer.id === sellerUser.id))
    );

    if (existingConversation) {
      return existingConversation.id;
    }

    const newConversation = {
      id: Date.now(),
      product: {
        id: product.id,
        title: product.title,
        image: product.image,
        price: product.price
      },
      participants: {
        seller: {
          id: sellerUser.id,
          name: sellerUser.name,
          avatar: sellerUser.avatar || null
        },
        buyer: {
          id: buyerUser.id,
          name: buyerUser.name,
          avatar: buyerUser.avatar || null
        }
      },
      lastMessage: {
        text: "",
        timestamp: new Date(),
        senderId: buyerUser.id
      },
      unread: false,
      messages: []
    };

    setConversations(prev => [...prev, newConversation]);
    return newConversation.id;
  };

  // Send a message
  const sendMessage = (conversationId, text) => {
    if (!text.trim()) return;
    
    const message = {
      id: Date.now(),
      senderId: currentUser.id,
      text: text.trim(),
      timestamp: new Date()
    };
    
    setConversations(prev => {
      return prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...(conv.messages || []), message],
            lastMessage: {
              text: text.trim(),
              timestamp: new Date(),
              senderId: currentUser.id
            },
            unread: true
          };
        }
        return conv;
      });
    });
  };

  // Mark conversation as read
  const markAsRead = (conversationId) => {
    setConversations(prev => {
      return prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            unread: false
          };
        }
        return conv;
      });
    });
  };

  // Add a listener for real-time updates
  const addListener = (callback) => {
    setListeners(prev => [...prev, callback]);
    return () => {
      setListeners(prev => prev.filter(listener => listener !== callback));
    };
  };

  return (
    <MessageContext.Provider value={{
      conversations,
      createConversation,
      sendMessage,
      markAsRead,
      addListener
    }}>
      {children}
    </MessageContext.Provider>
  );
};