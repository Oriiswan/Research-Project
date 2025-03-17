import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

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

// Create the provider component
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]); // Keep IDs for checking
  const [favorites, setFavorites] = useState([]); // Store full product objects
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    id: "user123", // Temporary ID for demo
    name: "Test User",
    email: "user@example.com"
  });

  // Load products from localStorage or mock data
  useEffect(() => {
    // Try to get products from localStorage
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
      // Set some initial mock products 
      const initialProducts = [
        {
          id: 1,
          title: "Calculus Textbook",
          price: 450,
          image: "/images/textbook.png",
          condition: "Good",
          description: "Slightly used calculus textbook for MATH101",
          seller: "Jane Student",
          sellerId: "user-123",
          inStock: true,
          category: "Books",
          status: "active"
        },
        {
          id: 2,
          title: "Scientific Calculator",
          price: 350,
          image: "/images/calculator.png",
          condition: "Like New",
          description: "Graphing calculator, perfect for science and math classes",
          seller: "Sam Tutor",
          sellerId: "user-456",
          inStock: true,
          category: "Electronics",
          status: "active"
        },
        {
          id: 3,
          title: "Lab Coat",
          price: 200,
          image: "/images/power-bank.png",
          condition: "New",
          description: "White lab coat, size M, never used",
          seller: "Chemistry Club",
          sellerId: "org-789",
          inStock: true,
          category: "Clothing",
          status: "active"
        }
      ];
      setProducts(initialProducts);
      localStorage.setItem('products', JSON.stringify(initialProducts));
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
      seller: currentUser.name,
      sellerId: currentUser.id // Ensure the current user's ID is attached to the product
    };
    
    const newProducts = [...products, newProduct];
    
    try {
      // Check if localStorage can handle the size
      const productsString = JSON.stringify(newProducts);
      console.log("Size of products data (MB):", productsString.length / (1024 * 1024));
      
      localStorage.setItem('products', productsString);
      setProducts(newProducts);
      console.log("Product added with image successfully");
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
    const newProducts = products.filter(product => product.id !== id);
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));
    
    // If this product is in favorites, remove it
    if (isProductFavorited(id)) {
      toggleFavorite(id);
    }
  };

  // Update product status
  const updateProductStatus = (productId, status) => {
    const updatedProducts = products.map(product => 
      product.id === productId ? { ...product, status } : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    // Update in favorites if needed
    if (isProductFavorited(productId)) {
      const updatedProduct = updatedProducts.find(p => p.id === productId);
      const updatedFavorites = favorites.map(fav => 
        fav.id === productId ? { ...updatedProduct, dateAdded: fav.dateAdded } : fav
      );
      setFavorites(updatedFavorites);
    }
  };

  // Toggle favorite status without navigation
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

  // Get user's listings - updated to use currentUser.id for filtering
  const getUserListings = () => {
    return products.filter(product => product.sellerId === currentUser.id);
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      userListings: getUserListings(), // Now computed dynamically based on current user
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
      favorites,
      getSortedFavorites,
      currentUser
    }}>
      {children}
    </ProductContext.Provider>
  );
};