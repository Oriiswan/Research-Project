import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from '../App'; // Import the auth context

// Create the context
export const ProductContext = createContext();

// Custom hook to use the product context
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const { currentUser } = useAuth(); // Get current user from auth context
  const [products, setProducts] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]); // Keep IDs for checking
  const [favorites, setFavorites] = useState([]); // Store full product objects
  const [loading, setLoading] = useState(true);

  // Load products and favorites from localStorage on initial render
  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    const storedFavoriteIds = localStorage.getItem('favoriteIds');
    
    if (storedProducts) {
      const parsedProducts = JSON.parse(storedProducts);
      setProducts(parsedProducts);
      
      // If we have favorite IDs, load the full favorite products
      if (storedFavoriteIds) {
        const ids = JSON.parse(storedFavoriteIds);
        setFavoriteIds(ids);
        
        // Find the full product objects for each favorite ID
        const favProducts = ids.map(id => {
          const product = parsedProducts.find(product => product.id === id);
          if (product) {
            // Add dateAdded if it doesn't exist
            return { ...product, dateAdded: product.dateAdded || Date.now() };
          }
          return undefined;
        }).filter(product => product !== undefined);
        
        setFavorites(favProducts);
      }
    } else {
      // Initialize with empty products array
      setProducts([]);
      localStorage.setItem('products', JSON.stringify([]));
    }
    
    setLoading(false);
  }, []);
  
  // Add a new product
  const addProduct = (product) => {
    const newProduct = { 
      ...product, 
      id: Date.now(),
      status: 'active',
      inStock: true,
      sellerName: currentUser ? currentUser.name : 'Unknown',
      sellerId: currentUser ? currentUser.id : 'unknown'
    };
    
    const newProducts = [...products, newProduct];
    
    try {
      // Check if localStorage can handle the size
      const productsString = JSON.stringify(newProducts);
      console.log("Size of products data (MB):", productsString.length / (1024 * 1024));
      
      localStorage.setItem('products', productsString);
      setProducts(newProducts);
      console.log("Product added successfully");
      return newProduct;
    } catch (e) {
      console.error("Error saving to localStorage:", e);
      // If localStorage fails due to size, try without the image data
      if (e.name === 'QuotaExceededError') {
        alert("Warning: Your image may be too large for browser storage. Consider using smaller images.");
        
        // Try to save without image data
        const smallerProduct = {...newProduct};
        if (smallerProduct.image && smallerProduct.image.length > 200000) {
          smallerProduct.image = '/images/textbook.png'; // Fallback to default
        }
        
        const smallerProducts = [...products, smallerProduct];
        localStorage.setItem('products', JSON.stringify(smallerProducts));
        setProducts(smallerProducts);
        return smallerProduct;
      }
      return newProduct;
    }
  };
  
  // Get a product by ID
  const getProductById = (id) => {
    const numId = typeof id === 'string' ? parseInt(id) : id;
    return products.find(product => product.id === numId);
  };

  // Update a product
  const updateProduct = (updatedProduct) => {
    const newProducts = products.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    );
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));
    
    // Update favorite if this product is in favorites
    if (isProductFavorited(updatedProduct.id)) {
      const updatedFavorites = favorites.map(fav => 
        fav.id === updatedProduct.id ? { ...updatedProduct, dateAdded: fav.dateAdded } : fav
      );
      setFavorites(updatedFavorites);
    }
  };

  // Delete a product
  const deleteProduct = (id) => {
    const numId = typeof id === 'string' ? parseInt(id) : id;
    const newProducts = products.filter(product => product.id !== numId);
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));
    
    // If this product is in favorites, remove it
    if (isProductFavorited(numId)) {
      toggleFavorite(numId);
    }
  };

  // Update product status
  const updateProductStatus = (productId, status) => {
    const numId = typeof productId === 'string' ? parseInt(productId) : productId;
    const updatedProducts = products.map(product => 
      product.id === numId ? { 
        ...product, 
        status,
        inStock: status === 'active' 
      } : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    // Update in favorites if needed
    if (isProductFavorited(numId)) {
      const updatedProduct = updatedProducts.find(p => p.id === numId);
      const updatedFavorites = favorites.map(fav => 
        fav.id === numId ? { ...updatedProduct, dateAdded: fav.dateAdded } : fav
      );
      setFavorites(updatedFavorites);
    }
  };

  // Check if a product belongs to the current user
  const isOwnProduct = (product) => {
    if (!product || !currentUser) return false;
    
    // Ensure both IDs are strings for comparison
    const productSellerId = String(product.sellerId);
    const userSellerId = String(currentUser.id);
    
    console.log("Comparing seller IDs:", {
      productSellerId,
      userSellerId,
      isMatch: productSellerId === userSellerId
    });
    
    return productSellerId === userSellerId;
  };

  // Toggle favorite status
  const toggleFavorite = (productId) => {
    const numId = typeof productId === 'string' ? parseInt(productId) : productId;
    
    if (favoriteIds.includes(numId)) {
      // Remove from favorites
      const newFavoriteIds = favoriteIds.filter(id => id !== numId);
      setFavoriteIds(newFavoriteIds);
      localStorage.setItem('favoriteIds', JSON.stringify(newFavoriteIds));
      
      // Remove from favorites objects array
      const newFavorites = favorites.filter(product => product.id !== numId);
      setFavorites(newFavorites);
    } else {
      // Add to favorites
      const newFavoriteIds = [...favoriteIds, numId];
      setFavoriteIds(newFavoriteIds);
      localStorage.setItem('favoriteIds', JSON.stringify(newFavoriteIds));
      
      // Add full product object to favorites array
      const product = getProductById(numId);
      if (product) {
        const newFavorite = {
          ...product,
          dateAdded: Date.now() // Add timestamp for sorting
        };
        setFavorites([...favorites, newFavorite]);
      }
    }
  };

const loadUsers = () => {
  const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
  if (storedUsers.length === 0) {
    // Add mock users similar to what's in LoginPage.js
    const mockUsers = [
      {
        id: 301,
        name: "Mark Buensalido",
        email: "markbuensalido@filamer.edu.ph",
        password: "password123",
        phone: "09624493722",
        bio: "Senior at FCU, TVL-ICT student. I love finding affordable textbooks and lab equipment!",
        location: "FCU Campus, Building C",
        avatar: "/images/markavatar.png",
      },
      // Add other mock users...
    ];
    localStorage.setItem('users', JSON.stringify(mockUsers));
    return mockUsers;
  }
  return storedUsers;
};

// Use this in your context provider initialization
const users = loadUsers();

  // Check if a product is favorited
  const isProductFavorited = (productId) => {
    const numId = typeof productId === 'string' ? parseInt(productId) : productId;
    return favoriteIds.includes(numId);
  };

  // Navigate to favorites page
  const navigateToFavorites = (navigate) => {
    navigate('/favorites');
  };

  // Navigate to favorites page after adding a product
  const addToFavoritesAndNavigate = (productId, navigate) => {
    // First ensure the product is favorited
    if (!isProductFavorited(productId)) {
      toggleFavorite(productId);
    }
    // Then navigate to favorites page
    navigateToFavorites(navigate);
  };

  // Get sorted favorites based on sort method
  const getSortedFavorites = (sortMethod) => {
    return [...favorites].sort((a, b) => {
      if (sortMethod === 'price-low') return a.price - b.price;
      if (sortMethod === 'price-high') return b.price - a.price;
      if (sortMethod === 'date-added') return b.dateAdded - a.dateAdded;
      return 0;
    });
  };

  // Get user's listings
  const getUserListings = () => {
    if (!currentUser) return [];
    
    return products.filter(product => {
      const productSellerId = String(product.sellerId);
      const userSellerId = String(currentUser.id);
      
      console.log("Checking listing:", {
        productTitle: product.title,
        productSellerId,
        userSellerId,
        isMatch: productSellerId === userSellerId
      });
      
      return productSellerId === userSellerId;
    });
  };
  

  return (
    <ProductContext.Provider value={{ 
      products, 
      userListings: getUserListings(), 
      loading, 
      addProduct,
      getProductById,
      updateProduct,
      deleteProduct,
      updateProductStatus,
      toggleFavorite,
      navigateToFavorites,
      addToFavoritesAndNavigate,
      isProductFavorited,
      isOwnProduct,
      favorites,
      favoriteIds,
      getSortedFavorites,
      currentUser
    }}>
      {children}
    </ProductContext.Provider>
  );
};