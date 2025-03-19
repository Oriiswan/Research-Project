import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../App'; // Import the auth context
import './ProfilePage.css';

const ProfilePage = () => {
  const { userListings, updateProductStatus, deleteProduct } = useProducts();
  const { currentUser, login } = useAuth(); // Get current user from auth context
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    avatar: ''
  });
  
  // Update form data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        bio: currentUser.bio || '',
        location: currentUser.location || '',
        avatar: currentUser.avatar || ''
      });
    }
  }, [currentUser]);
  
  // Mock user statistics
  const userStats = {
    itemsSold: userListings.filter(item => item.status === 'sold').length,
    itemsListed: userListings.length,
    favorites: 5,
    memberSince: 'January 2023',
    avgRating: 4.8
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Update the user data in the auth context
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location,
        avatar: formData.avatar
      };
      
      // Update the user in the auth context and localStorage
      login(updatedUser);
      setIsEditing(false);
    }
  };
  
  const cancelEdit = () => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        bio: currentUser.bio || '',
        location: currentUser.location || '',
        avatar: currentUser.avatar || ''
      });
    }
    setIsEditing(false);
  };
  
  const handleStatusChange = (itemId, newStatus) => {
    updateProductStatus(itemId, newStatus);
  };
  
  // Handle delete confirmation
  const confirmDelete = (productId) => {
    const product = userListings.find(item => item.id === productId);
    setProductToDelete(product);
    setShowDeleteModal(true);
  };
  
  // Handle final delete
  const handleDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };
  
  if (!currentUser) {
    return <div className="loading">Loading profile...</div>;
  }
  
  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        {!isEditing && (
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>
      
      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            {formData.avatar ? (
              <img src={formData.avatar} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                {formData.name.split(' ').map(name => name[0]).join('')}
              </div>
            )}
          </div>
          
          <div className="user-stats">
            <h3>Stats</h3>
            <div className="stat-item">
              <span>Items Sold:</span> {userStats.itemsSold}
            </div>
            <div className="stat-item">
              <span>Items Listed:</span> {userStats.itemsListed}
            </div>
            <div className="stat-item">
              <span>Favorites:</span> {userStats.favorites}
            </div>
            <div className="stat-item">
              <span>Member Since:</span> {userStats.memberSince}
            </div>
            <div className="stat-item">
              <span>Rating:</span> {userStats.avgRating}/5
            </div>
          </div>
        </div>
        
        {isEditing ? (
          <div className="profile-details">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-button">Save Changes</button>
                <button type="button" className="cancel-button" onClick={cancelEdit}>Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="profile-details">
            <div className="detail-item">
              <span>Name:</span> {formData.name}
            </div>
            <div className="detail-item">
              <span>Email:</span> {formData.email}
            </div>
            {formData.phone && (
              <div className="detail-item">
                <span>Phone:</span> {formData.phone}
              </div>
            )}
            {formData.location && (
              <div className="detail-item">
                <span>Location:</span> {formData.location}
              </div>
            )}
            {formData.bio && (
              <div className="detail-item bio">
                <span>Bio:</span> 
                <p>{formData.bio}</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="user-listings">
        <h2>My Listings</h2>
        {userListings.length > 0 ? (
          <div className="listings-grid">
            {userListings.map(listing => (
              <div key={listing.id} className={`listing-card ${listing.status}`}>
                <div className="listing-image">
                  <img src={listing.image} alt={listing.title} />
                  {listing.status === 'sold' && <div className="sold-badge">SOLD</div>}
                </div>
                <div className="listing-info">
                  <h3>{listing.title}</h3>
                  <p className="listing-price">₱{listing.price}</p>
                  <div className="listing-actions">
                    <Link to={`/product/${listing.id}`} className="view-button">View</Link>
                    <select 
                      className="status-select"
                      value={listing.status}
                      onChange={(e) => handleStatusChange(listing.id, e.target.value)}
                    >
                      <option value="active">Active</option>
                      <option value="sold">Sold</option>
                    </select>
                    <button 
                      className="delete-button"
                      onClick={() => confirmDelete(listing.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-listings">
            <p>You haven't listed any items yet.</p>
            <Link to="/sell" className="sell-button">Sell Something</Link>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to remove <strong>{productToDelete?.title}</strong>?</p>
            <p>This action cannot be undone.</p>
            
            <div className="modal-actions">
              <button 
                className="cancel-modal-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-delete-btn"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;