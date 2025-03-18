import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SellPage.css';

function StudentVerification({ onVerificationComplete }) {
  const navigate = useNavigate();
  const [verificationMethod, setVerificationMethod] = useState('idNumber');
  const [idNumber, setIdNumber] = useState('');
  const [idImage, setIdImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setIdImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const validateIdNumber = (id) => {
    // Check if ID matches the pattern: "25-SHS12-0156" (year-SHS+grade-number)
    // Current year-SHS(11 OR 12)-4 random numbers
    const currentYear = new Date().getFullYear().toString().slice(-2); // Get last 2 digits of current year
    const pattern = new RegExp(`^${currentYear}-SHS(11|12)-\\d{4}$`);
    return pattern.test(id);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (verificationMethod === 'idNumber') {
      if (!validateIdNumber(idNumber)) {
        setError(`Please enter a valid ID number in the format "25-SHS11-0156" or "25-SHS12-0156"`);
        return;
      }
      
      setLoading(true);
      
      try {
        // In a real application, you would send this to your backend API
        // For this example, we'll simulate a verification check
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
        
        // Verification successful
        onVerificationComplete();
      } catch (err) {
        setError('Failed to verify ID. Please try again or use another method.');
      } finally {
        setLoading(false);
      }
    } else if (verificationMethod === 'idImage') {
      if (!idImage) {
        setError('Please upload an image of your student ID');
        return;
      }
      
      setLoading(true);
      
      try {
        // In a real application, you would send this to your backend API
        // For this example, we'll simulate a verification check
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
        
        // Verification successful
        onVerificationComplete();
      } catch (err) {
        setError('Failed to verify ID image. Please try again or use another method.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="verification-container">
      <h2>Student Verification</h2>
      <p className="verification-instruction">
        To ensure our marketplace is exclusive to students, please verify your student status.
      </p>
      
      <div className="verification-method-selector">
        <div
          className={`method-option ${verificationMethod === 'idNumber' ? 'active' : ''}`}
          onClick={() => setVerificationMethod('idNumber')}
        >
          <span className="method-icon">🔢</span>
          <span className="method-name">Student ID Number</span>
        </div>
        <div
          className={`method-option ${verificationMethod === 'idImage' ? 'active' : ''}`}
          onClick={() => setVerificationMethod('idImage')}
        >
          <span className="method-icon">📷</span>
          <span className="method-name">ID Card Photo</span>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="verification-form">
        {verificationMethod === 'idNumber' ? (
          <div className="form-group">
            <label htmlFor="idNumber">Enter your student ID number</label>
            <input
              type="text"
              id="idNumber"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="e.g. 25-SHS12-0156"
              required
            />
            <p className="form-hint">
              Your ID number follows the pattern: [year]-SHS[grade]-[4 digits]
              <br />
              Example: 25-SHS12-0156
            </p>
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="idImage">Upload a photo of your student ID</label>
            <div 
              className="id-upload-box"
              onClick={() => document.getElementById('id-image-input').click()}
              style={{
                backgroundImage: idImage ? `url(${idImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {!idImage && <span>Click to upload ID</span>}
              <input
                type="file"
                id="id-image-input"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </div>
            <p className="form-hint">
              Make sure all details are clearly visible. We'll blur sensitive information.
            </p>
          </div>
        )}
        
        <div className="form-actions">
          <button type="button" className="back-btn" onClick={handleBack}>
            Back
          </button>
          <button type="submit" className="continue-btn" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default StudentVerification;