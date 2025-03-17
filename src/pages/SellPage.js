import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { compressImage } from '../utils/imageUtils'; // Import the new utility
import './SellPage.css';

function SellPage() {
  const navigate = useNavigate();
  const { addProduct, currentUser } = useProducts();
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Textbooks',
    subcategory: 'Mathematics',
    condition: 'Slightly Used',
    gradeLevel: 'Grade 11',
    price: '',
    quantity: 1,
    originalPrice: '',
    description: '',
    isNegotiable: false,
    contactPreferences: {
      inAppMessaging: true,
      phoneCall: false,
      sms: false
    }
  });
  
  const [images, setImages] = useState({
    main: null,
    additional: [null, null, null, null]
  });
  
  const handleImageChange = async (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        // Compress the image before setting it in state
        const compressedImage = await compressImage(event.target.result);
        
        if (index === 'main') {
          setImages({
            ...images,
            main: compressedImage
          });
        } else {
          const newAdditional = [...images.additional];
          newAdditional[index] = compressedImage;
          setImages({
            ...images,
            additional: newAdditional
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name.startsWith('contact-')) {
        const preference = name.replace('contact-', '');
        setFormData({
          ...formData,
          contactPreferences: {
            ...formData.contactPreferences,
            [preference]: checked
          }
        });
      } else {
        setFormData({
          ...formData,
          [name]: checked
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert("You need to be logged in to sell items");
      navigate('/login');
      return;
    }
    
    try {
      // Add the product using our context function
      const newProduct = addProduct({
        ...formData,
        price: parseFloat(formData.price) || 0,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        image: images.main || '/images/textbook.png', // Use uploaded image or default
        seller: currentUser.name,
        sellerId: currentUser.id,
        inStock: true,
        additionalImages: images.additional.filter(img => img !== null),
        dateAdded: Date.now()
      });
      
      console.log('Product added successfully:', newProduct);
      
      // Navigate to profile page to see user listings
      navigate('/profile');
    } catch (error) {
      console.error("Error adding product:", error);
      alert("There was an error adding your product. Please try again with smaller images.");
    }
  };
  
  const handleBack = () => {
    // Navigate to previous step or page
    navigate(-1);
  };
  
  return (
    <div className="sell-page">
      <div className="progress-tracker">
        <div className="step active">
          <span className="step-number">1</span>
          <span className="step-name">Account Verification</span>
        </div>
        <div className="step active">
          <span className="step-number">2</span>
          <span className="step-name">Product Details</span>
        </div>
        <div className="step">
          <span className="step-number">3</span>
          <span className="step-name">Review & Submit</span>
        </div>
      </div>
      
      <div className="sell-form-container">
        <h1>Sell Your Item</h1>
        <p className="instruction">Step 2: Enter product details below to list your item on the marketplace.</p>
        
        <form className="sell-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Product Information</h2>
            
            <div className="form-group">
              <label htmlFor="title">Product Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="e.g. Grade 11 Math Textbook (Barely Used)"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="Textbooks">Textbooks</option>
                  <option value="Art Supplies">Art Supplies</option>
                  <option value="School Supplies">School Supplies</option>
                  <option value="Uniforms">Uniforms</option>
                  <option value="Electronics">Electronics</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="subcategory">Subcategory *</label>
                <select
                  id="subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  required
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="Filipino">Filipino</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="condition">Condition *</label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                >
                  <option value="Brand New">Brand New</option>
                  <option value="Slightly Used">Slightly Used</option>
                  <option value="Used">Used</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="gradeLevel">Grade Level *</label>
                <select
                  id="gradeLevel"
                  name="gradeLevel"
                  value={formData.gradeLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Pricing Details</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price (₱) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="350.00"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="quantity">Quantity Available *</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="originalPrice">Original Price (₱) (optional)</label>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  placeholder="e.g. 500.00"
                  value={formData.originalPrice}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="isNegotiable"
                  name="isNegotiable"
                  checked={formData.isNegotiable}
                  onChange={handleChange}
                />
                <label htmlFor="isNegotiable">Price Negotiable</label>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Product Details</h2>
            
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe your item, include details about the condition, features, etc."
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Product Images</h2>
            <p>Upload Photos * (up to 5)</p>
            
            <div className="image-upload-container">
              <div className="image-upload-box main-photo" 
                  onClick={() => document.getElementById('main-image').click()}
                  style={{
                    backgroundImage: images.main ? `url(${images.main})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}>
                {!images.main && <span>Main Photo</span>}
                <input 
                  type="file" 
                  id="main-image" 
                  accept="image/*" 
                  onChange={(e) => handleImageChange(e, 'main')} 
                  hidden 
                />
              </div>
              
              {[...Array(4)].map((_, i) => (
                <div key={i} 
                  className="image-upload-box" 
                  onClick={() => document.getElementById(`additional-image-${i}`).click()}
                  style={{
                    backgroundImage: images.additional[i] ? `url(${images.additional[i]})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}>
                  {!images.additional[i] && <span>+</span>}
                  <input 
                    type="file" 
                    id={`additional-image-${i}`} 
                    accept="image/*" 
                    onChange={(e) => handleImageChange(e, i)} 
                    hidden 
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-section">
            <h2>Contact Preferences</h2>
            
            <div className="contact-options">
              <div className="contact-option">
                <input
                  type="checkbox"
                  id="contact-inAppMessaging"
                  name="contact-inAppMessaging"
                  checked={formData.contactPreferences.inAppMessaging}
                  onChange={handleChange}
                />
                <label htmlFor="contact-inAppMessaging">In-app messaging</label>
              </div>
              
              <div className="contact-option">
                <input
                  type="checkbox"
                  id="contact-phoneCall"
                  name="contact-phoneCall"
                  checked={formData.contactPreferences.phoneCall}
                  onChange={handleChange}
                />
                <label htmlFor="contact-phoneCall">Phone call</label>
              </div>
              
              <div className="contact-option">
                <input
                  type="checkbox"
                  id="contact-sms"
                  name="contact-sms"
                  checked={formData.contactPreferences.sms}
                  onChange={handleChange}
                />
                <label htmlFor="contact-sms">SMS</label>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="back-btn" onClick={handleBack}>Back</button>
            <button type="submit" className="continue-btn">Continue</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SellPage;