import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { compressImage } from '../utils/imageUtils';
import StudentVerification from './StudentVerification';
import './SellPage.css';

function SellPage() {
  const navigate = useNavigate();
  const { addProduct, currentUser } = useProducts();
  const [currentStep, setCurrentStep] = useState('verification'); // Start with verification step
  
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
  
  const handleVerificationComplete = () => {
    setCurrentStep('details');
  };
  
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
  
  const handleDetailsComplete = (e) => {
    e.preventDefault();
    // Validate form data before proceeding to review step
    if (!formData.title || !formData.description || !formData.price || !images.main) {
      alert("Please fill in all required fields and add a main product image");
      return;
    }
    setCurrentStep('review');
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
    if (currentStep === 'details') {
      setCurrentStep('verification');
    } else if (currentStep === 'review') {
      setCurrentStep('details');
    } else {
      // Navigate to previous page
      navigate(-1);
    }
  };
  
  return (
    <div className="sell-page">
      <div className="progress-tracker">
        <div className={`step ${currentStep === 'verification' ? 'active' : ''}`}>
          <span className="step-number">1</span>
          <span className="step-name">Account Verification</span>
        </div>
        <div className={`step ${currentStep === 'details' ? 'active' : ''}`}>
          <span className="step-number">2</span>
          <span className="step-name">Product Details</span>
        </div>
        <div className={`step ${currentStep === 'review' ? 'active' : ''}`}>
          <span className="step-number">3</span>
          <span className="step-name">Review & Submit</span>
        </div>
      </div>
      
      <div className="sell-form-container">
        {currentStep === 'verification' && (
          <StudentVerification onVerificationComplete={handleVerificationComplete} />
        )}
        
        {currentStep === 'details' && (
          <>
            <h1>Sell Your Item</h1>
            <p className="instruction">Step 2: Enter product details below to list your item on the marketplace.</p>
            
            <form className="sell-form" onSubmit={handleDetailsComplete}>
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
                    <label htmlFor="subcategory">Optional for Textbook*</label>
                    <select
                      id="subcategory"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleChange}
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
          </>
        )}

{currentStep === 'review' && (
  <div className="review-submit-container">
    <h1>Review Your Listing</h1>
    <p className="instruction">Step 3: Please review your product details before final submission.</p>
    
    <div className="review-content">
      {/* Product Preview Card */}
      <div className="preview-card">
        <div className="preview-card-header">
          <h2>Product Preview</h2>
          <span className="preview-subtitle">This is how your listing will appear to buyers</span>
        </div>
        
        <div className="product-preview-container">
          <div className="preview-image-container">
            {images.main ? (
              <div className="preview-main-image" style={{
                backgroundImage: `url(${images.main})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>
            ) : (
              <div className="preview-main-image placeholder">
                <span>No image uploaded</span>
              </div>
            )}
            
            <div className="preview-thumbnails">
              {images.additional.map((img, i) => (
                img && (
                  <div 
                    key={i} 
                    className="preview-thumbnail" 
                    style={{
                      backgroundImage: `url(${img})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                )
              ))}
            </div>
          </div>
          
          <div className="preview-details-container">
            <h3 className="preview-title">{formData.title}</h3>
            <div className="preview-badges">
              <span className="badge condition-badge">{formData.condition}</span>
              <span className="badge category-badge">{formData.category}</span>
              <span className="badge grade-badge">{formData.gradeLevel}</span>
              {formData.isNegotiable && <span className="badge negotiable-badge">Negotiable</span>}
            </div>
            
            <div className="preview-price-container">
              <span className="current-price">₱{formData.price}</span>
              {formData.originalPrice && (
                <>
                  <span className="original-price">₱{formData.originalPrice}</span>
                  <span className="discount-badge">
                    {Math.round((1 - parseFloat(formData.price) / parseFloat(formData.originalPrice)) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
            
            <div className="preview-description-snippet">
              <p>{formData.description.length > 100 ? 
                `${formData.description.substring(0, 100)}...` : 
                formData.description}
              </p>
            </div>
            
            <div className="preview-seller-info">
              <div className="seller-avatar"></div>
              <div className="seller-name">
                <span>You</span>
                <span className="seller-verified-badge">Verified Student</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Collapsible Details Accordion */}
      <div className="details-accordion">
        <div className="accordion-section">
          <button className="accordion-toggle">
            <h3>Product Information</h3>
            <span className="toggle-icon">+</span>
          </button>
          <div className="accordion-content">
            <table className="details-table">
              <tbody>
                <tr>
                  <th>Title</th>
                  <td>{formData.title}</td>
                </tr>
                <tr>
                  <th>Category</th>
                  <td>{formData.category}</td>
                </tr>
                {formData.category === 'Textbooks' && (
                  <tr>
                    <th>Subject</th>
                    <td>{formData.subcategory}</td>
                  </tr>
                )}
                <tr>
                  <th>Condition</th>
                  <td>{formData.condition}</td>
                </tr>
                <tr>
                  <th>Grade Level</th>
                  <td>{formData.gradeLevel}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="accordion-section">
          <button className="accordion-toggle">
            <h3>Pricing Details</h3>
            <span className="toggle-icon">+</span>
          </button>
          <div className="accordion-content">
            <table className="details-table">
              <tbody>
                <tr>
                  <th>Price</th>
                  <td>₱{formData.price}</td>
                </tr>
                <tr>
                  <th>Quantity</th>
                  <td>{formData.quantity}</td>
                </tr>
                {formData.originalPrice && (
                  <tr>
                    <th>Original Price</th>
                    <td>₱{formData.originalPrice}</td>
                  </tr>
                )}
                <tr>
                  <th>Negotiable</th>
                  <td>{formData.isNegotiable ? 'Yes' : 'No'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="accordion-section">
          <button className="accordion-toggle">
            <h3>Full Description</h3>
            <span className="toggle-icon">+</span>
          </button>
          <div className="accordion-content">
            <div className="full-description">
              <p>{formData.description}</p>
            </div>
          </div>
        </div>
        
        <div className="accordion-section">
          <button className="accordion-toggle">
            <h3>Contact Preferences</h3>
            <span className="toggle-icon">+</span>
          </button>
          <div className="accordion-content">
            <table className="details-table">
              <tbody>
                <tr>
                  <th>In-app messaging</th>
                  <td>{formData.contactPreferences.inAppMessaging ? '✓ Enabled' : '✗ Disabled'}</td>
                </tr>
                <tr>
                  <th>Phone call</th>
                  <td>{formData.contactPreferences.phoneCall ? '✓ Enabled' : '✗ Disabled'}</td>
                </tr>
                <tr>
                  <th>SMS</th>
                  <td>{formData.contactPreferences.sms ? '✓ Enabled' : '✗ Disabled'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Final Actions */}
      <div className="final-review-actions">
        <div className="review-summary">
          <h3>Ready to publish?</h3>
          <p>Your listing will be visible to all students in your school after submission.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="review-form">
          <div className="terms-agreement">
            <input type="checkbox" id="terms-agreement" required />
            <label htmlFor="terms-agreement">I agree to the <a href="#">Marketplace Terms</a> and confirm this item complies with school policies</label>
          </div>
          
          <div className="form-actions">
            <button type="button" className="edit-btn" onClick={handleBack}>
              <span className="btn-icon">✎</span> Edit Details
            </button>
            <button type="submit" className="submit-btn">
              <span className="btn-icon">✓</span> Publish Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

        )}
      </div>
    </div>
  );
}

export default SellPage;