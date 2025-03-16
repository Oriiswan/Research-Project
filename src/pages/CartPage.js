import React from 'react';
import { Link } from 'react-router-dom'; // ✅ Add this line
import './CartPage.css';

function CartPage({ cart }) {
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          {/* ✅ Use a valid route path instead of a file name */}
          <Link to="/browse">
            <button className="browse-btn">Browse Products</button>
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={`${item.id}-${index}`} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p className="item-price">₱{item.price.toFixed(2)}</p>
                  {item.condition && <p className="item-condition">{item.condition}</p>}
                  {item.seller && <p className="item-seller">Seller: {item.seller}</p>}
                </div>
                <div className="item-actions">
                  <button className="remove-btn">Remove</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal ({cart.length} items):</span>
              <span>₱{calculateTotal()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>₱0.00</span>
            </div>
            <div className="summary-total">
              <span>Total:</span>
              <span>₱{calculateTotal()}</span>
            </div>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
