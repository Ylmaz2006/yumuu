// Create a new file: src/components/PaymentMethods.js

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './PaymentMethods.css';

const stripePromise = loadStripe("pk_test_51ReQRi2MPLgaUEDUiPlGBf9YtJoq1caYHQLV95Z0vbHvPQoDaDUc2fic72lNqCYcLNdNRKvzSroRKdgoJoR7Yzxz00555fGeyp");

const PaymentMethodForm = ({ onPaymentMethodAdded, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [billingAddress, setBillingAddress] = useState({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError('Stripe is not loaded yet');
      return;
    }

    setLoading(true);
    setError('');

    const cardElement = elements.getElement(CardElement);
    
    try {
      // Create payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: billingAddress.name,
          address: {
            line1: billingAddress.line1,
            line2: billingAddress.line2,
            city: billingAddress.city,
            state: billingAddress.state,
            postal_code: billingAddress.postal_code,
            country: billingAddress.country,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      // Send to backend
      const email = localStorage.getItem('userEmail');
      const response = await fetch('https://nback-6gqw.onrender.com/api/add-payment-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          paymentMethodId: paymentMethod.id,
          billingAddress,
          setAsDefault: true,
          nickname: `${paymentMethod.card.brand.toUpperCase()} ending in ${paymentMethod.card.last4}`
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        onPaymentMethodAdded(data.card);
      } else {
        setError(data.message || 'Failed to add payment method');
      }

    } catch (err) {
      setError('Failed to add payment method: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-method-form">
      <h3>Add Credit Card</h3>
      
      <div className="form-group">
        <label>Cardholder Name</label>
        <input
          type="text"
          value={billingAddress.name}
          onChange={(e) => setBillingAddress({...billingAddress, name: e.target.value})}
          placeholder="John Doe"
          required
        />
      </div>

      <div className="form-group">
        <label>Card Information</label>
        <div className="card-element-wrapper">
          <CardElement 
            className="card-element"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="billing-address">
        <h4>Billing Address</h4>
        
        <div className="form-row">
          <div className="form-group">
            <label>Address Line 1</label>
            <input
              type="text"
              value={billingAddress.line1}
              onChange={(e) => setBillingAddress({...billingAddress, line1: e.target.value})}
              placeholder="123 Main St"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Address Line 2 (Optional)</label>
            <input
              type="text"
              value={billingAddress.line2}
              onChange={(e) => setBillingAddress({...billingAddress, line2: e.target.value})}
              placeholder="Apt 4B"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={billingAddress.city}
              onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
              placeholder="New York"
              required
            />
          </div>
          
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              value={billingAddress.state}
              onChange={(e) => setBillingAddress({...billingAddress, state: e.target.value})}
              placeholder="NY"
              required
            />
          </div>
          
          <div className="form-group">
            <label>ZIP Code</label>
            <input
              type="text"
              value={billingAddress.postal_code}
              onChange={(e) => setBillingAddress({...billingAddress, postal_code: e.target.value})}
              placeholder="10001"
              required
            />
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-actions">
        <button 
          type="button" 
          onClick={onCancel}
          className="cancel-btn"
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          type="submit"
          className={`submit-btn ${loading ? 'loading' : ''}`}
          disabled={loading || !stripe}
        >
          {loading ? 'Adding Card...' : 'Add Payment Method'}
        </button>
      </div>
    </form>
  );
};

const PaymentMethodCard = ({ card, onRemove, onSetDefault, isRemoving }) => {
  const getCardIcon = (brand) => {
    const icons = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      discover: '💳',
      diners: '💳',
      jcb: '💳',
      unionpay: '💳'
    };
    return icons[brand] || '💳';
  };

  return (
    <div className={`payment-card ${card.isDefault ? 'default-card' : ''}`}>
      <div className="card-info">
        <div className="card-header">
          <span className="card-icon">{getCardIcon(card.brand)}</span>
          <span className="card-details">
            {card.brand.toUpperCase()} •••• {card.last4}
          </span>
          {card.isDefault && <span className="default-badge">Default</span>}
        </div>
        
        <div className="card-meta">
          <span>Expires {card.expMonth}/{card.expYear}</span>
          {card.nickname && <span className="card-nickname">{card.nickname}</span>}
        </div>
      </div>
      
      <div className="card-actions">
        {!card.isDefault && (
          <button 
            onClick={() => onSetDefault(card.stripePaymentMethodId)}
            className="set-default-btn"
          >
            Set as Default
          </button>
        )}
        <button 
          onClick={() => onRemove(card.stripePaymentMethodId)}
          className={`remove-btn ${isRemoving ? 'loading' : ''}`}
          disabled={isRemoving}
        >
          {isRemoving ? 'Removing...' : 'Remove'}
        </button>
      </div>
    </div>
  );
};

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState('');
  const [removingCard, setRemovingCard] = useState(null);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      const response = await fetch('https://nback-6gqw.onrender.com/api/get-payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        setPaymentMethods(data.paymentInfo.cards || []);
      } else {
        setError(data.message || 'Failed to load payment methods');
      }
    } catch (err) {
      setError('Failed to load payment methods: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodAdded = (newCard) => {
    setPaymentMethods(prev => [...prev, newCard]);
    setShowAddForm(false);
    setError('');
  };

  const handleRemoveCard = async (paymentMethodId) => {
    setRemovingCard(paymentMethodId);
    
    try {
      const email = localStorage.getItem('userEmail');
      const response = await fetch('https://nback-6gqw.onrender.com/api/remove-payment-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, paymentMethodId }),
      });

      const data = await response.json();
      if (data.success) {
        setPaymentMethods(prev => prev.filter(card => card.stripePaymentMethodId !== paymentMethodId));
      } else {
        setError(data.message || 'Failed to remove payment method');
      }
    } catch (err) {
      setError('Failed to remove payment method: ' + err.message);
    } finally {
      setRemovingCard(null);
    }
  };

  const handleSetDefault = async (paymentMethodId) => {
    try {
      const email = localStorage.getItem('userEmail');
      const response = await fetch('https://nback-6gqw.onrender.com/api/set-default-payment-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, paymentMethodId }),
      });

      const data = await response.json();
      if (data.success) {
        setPaymentMethods(prev => prev.map(card => ({
          ...card,
          isDefault: card.stripePaymentMethodId === paymentMethodId
        })));
      } else {
        setError(data.message || 'Failed to set default payment method');
      }
    } catch (err) {
      setError('Failed to set default payment method: ' + err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading payment methods...</div>;
  }

  return (
    <div className="payment-methods-section">
      <div className="section-header">
        <h2>💳 Payment Methods</h2>
        <p>Manage your payment methods for Premium subscriptions</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="payment-methods-list">
        {paymentMethods.length === 0 ? (
          <div className="no-payment-methods">
            <p>No payment methods added yet</p>
          </div>
        ) : (
          paymentMethods.map((card, index) => (
            <PaymentMethodCard
              key={card.stripePaymentMethodId || index}
              card={card}
              onRemove={handleRemoveCard}
              onSetDefault={handleSetDefault}
              isRemoving={removingCard === card.stripePaymentMethodId}
            />
          ))
        )}
      </div>

      {!showAddForm ? (
        <button 
          onClick={() => setShowAddForm(true)}
          className="add-payment-btn"
        >
          + Add New Payment Method
        </button>
      ) : (
        <Elements stripe={stripePromise}>
          <PaymentMethodForm
            onPaymentMethodAdded={handlePaymentMethodAdded}
            onCancel={() => setShowAddForm(false)}
          />
        </Elements>
      )}
    </div>
  );
};

export default PaymentMethods;