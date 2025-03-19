import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Enhanced mock user accounts with more details
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
    {
      id: 302,
      name: "Rainier Dela Cruz",
      email: "rainier23@filamer.edu.ph",
      password: "seller456",
      phone: "0996283212",
      bio: "Graduating this year! Selling all my textbooks and dorm supplies. Great deals available!",
      location: "FCU Campus, Building A",
      avatar: "/images/rainieravatar.png"
    },
    {
      id: 303,
      name: "Professor Johnson",
      email: "johnson@fcu.edu",
      password: "faculty789",
      phone: "555-246-8135",
      bio: "Economics professor. Looking for research materials and occasionally selling academic books.",
      location: "FCU Faculty Building",
      avatar: ""
    },
    {
      id: 304,
      name: "Taylor Student",
      email: "taylor@student.edu",
      password: "campus321",
      phone: "555-369-1470",
      bio: "Sophomore studying Biology. Always on the lookout for lab equipment and second-hand textbooks.",
      location: "FCU Dorms, Building E",
      avatar: ''
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Find user with matching email
    const user = mockUsers.find(user => user.email === email);
    
    if (user && user.password === password) {
      // Clear any previous errors
      setError('');
      
      // Initialize user products if needed
      ensureUserProducts(user.id);
      
      // Call the onLogin function with the authenticated user
      onLogin(user);
      
      // Redirect to home page
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
  };

  // Ensure the user has some products in the system
  const ensureUserProducts = (userId) => {
    // Get existing products from localStorage
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    
    // Check if the user already has products
    const userHasProducts = storedProducts.some(product => product.sellerId === userId);
    
    // If the user doesn't have products, add some sample ones
    if (!userHasProducts) {
      const sampleProducts = getSampleProductsForUser(userId);
      const updatedProducts = [...storedProducts, ...sampleProducts];
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }
  };

  // Generate sample products for a user
  const getSampleProductsForUser = (userId) => {
    // Get the user name from the mock users
    const user = mockUsers.find(user => user.id === userId);
    const userName = user ? user.name : "Unknown User";
    
    // Sample products
    if (userId === 301) {  // Maria Buyer (no products)
      return [];
    } else if (userId === 302) {  // Alex Seller
      return [
        {
          id: 1001,
          title: "Calculus Textbook",
          price: 650,
          description: "Calculus: Early Transcendentals, 8th Edition. Good condition with minimal highlighting.",
          category: "Textbooks",
          image: "/images/calculus-book.jpg",
          status: "active",
          sellerId: userId,
          sellerName: userName
        },
        {
          id: 1002,
          title: "Desk Lamp",
          price: 250,
          description: "Adjustable LED desk lamp with USB charging port. Perfect for dorm rooms.",
          category: "Electronics",
          image: "/images/desk-lamp.jpg",
          status: "active",
          sellerId: userId,
          sellerName: userName
        }
      ];
    } else if (userId === 303) {  // Professor Johnson
      return [
        {
          id: 1003,
          title: "Economics Research Papers",
          price: 320,
          description: "Collection of research papers on Microeconomics. Great for advanced students.",
          category: "Academic",
          image: "/images/research-papers.jpg",
          status: "active",
          sellerId: userId,
          sellerName: userName
        }
      ];
    } else if (userId === 304) {  // Taylor Student
      return [
        {
          id: 1004,
          title: "Biology Lab Kit",
          price: 450,
          description: "Complete biology lab kit with microscope slides, petri dishes, and basic tools.",
          category: "Lab Equipment",
          image: "/images/lab-kit.jpg",
          status: "active",
          sellerId: userId,
          sellerName: userName
        },
        {
          id: 1005,
          title: "Dorm Coffee Maker",
          price: 200,
          description: "Single-serve coffee maker, perfect for busy mornings. Only used for one semester.",
          category: "Appliances",
          image: "/images/coffee-maker.jpg",
          status: "sold",
          sellerId: userId,
          sellerName: userName
        }
      ];
    }
    
    return [];
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome to FCU Marketplace</h2>
        <p className="login-subtitle">Login to buy, sell and message other students</p>
        
        {error && <div className="login-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" className="login-button">Login</button>
        </form>
        
        <div className="login-demo">
          <h3>Demo Accounts</h3>
          <div className="demo-accounts">
            {mockUsers.map(user => (
              <div 
                key={user.id} 
                className="demo-account"
                onClick={() => {
                  setEmail(user.email);
                  setPassword(user.password);
                }}
              >
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;