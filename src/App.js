import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Signup from './Signup';

import Landing from './Landing';
import VerifyEmail from './VerifyEmail';
import CheckoutForm from './CheckoutForm';
import './Login.css';
import { auth, provider } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import SettingsPage from './SettingsPage';
import ClipTuneGenerator from './ClipTuneGenerator';


const stripePromise = loadStripe('pk_test_51ReQRi2MPLgaUEDUiPlGBf9YtJoq1caYHQLV95Z0vbHvPQoDaDUc2fic72lNqCYcLNdNRKvzSroRKdgoJoR7Yzxz00555fGeyp');

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('userEmail', email);
        setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
        setTimeout(() => navigate('/interface'), 1500);
      } else {
        setMessage({ text: data.message || 'Login failed', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Connection error. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await fetch('http://localhost:5000/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userEmail', data.email);
        setMessage({ text: 'Google login successful! Redirecting...', type: 'success' });

        setTimeout(() => {
          if (data.isNewUser) {
            navigate('/checkout');
          } else {
            navigate('/settings');
          }
        }, 1500);
      } else {
        setMessage({ text: data.message || 'Login failed', type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Google login failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => navigate('/forgot-password');
  const handleSignup = () => navigate('/signup');
  const goBack = () => navigate('/');
return (
<div style={{ minHeight: '100vh', width: '100%', backgroundColor: '#f8f9fa', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
  <div className="auth-card">
    <div className="auth-header">
      {/* Assuming a sleek, modern logo for SoundAI */}
      <div className="logo-placeholder"></div>
      <h1 className="auth-title">Welcome Back</h1>
      <p className="auth-subtitle">Sign in to your SoundAI account</p>
    </div>

    <form className="auth-form" onSubmit={handleLogin}>
      <div className="form-group">
        <label htmlFor="email" className="form-label">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="your@email.com"
          className="form-input"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          className="form-input"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
        />
        <div className="forgot-password-link">
          <a href="#" onClick={e => { e.preventDefault(); handleForgotPassword(); }}>
            Forgot password?
          </a>
        </div>
      </div>

      <button
        type="submit"
        className={`primary-btn ${loading ? 'loading' : ''}`}
        disabled={loading}
      >
        <div className="spinner"></div>
        {loading ? 'Signing In...' : 'Sign In'}
      </button>

      {message.text && (
        <div className={`message-box ${message.type}`}>
          {message.text}
        </div>
      )}
    </form>

    <div className="separator">
      <span className="separator-text">OR</span>
    </div>

    <button
      type="button"
      onClick={handleGoogleLogin}
      className="google-auth-btn"
      disabled={loading}
    >
      <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google logo" className="google-icon" />
      Continue with Google
    </button>

    <div className="create-account-prompt">
      <p>Don't have an account yet? Join thousands of creators using AI to enhance their videos.</p>
      <button className="secondary-btn" onClick={handleSignup} disabled={loading}>
        Create Account
      </button>
    </div>

    <div className="back-home-link">
      <a href="#" onClick={e => { e.preventDefault(); goBack(); }}>
        ← Back to home
      </a>
    </div>
  </div>
</div>
);
}
 
function CheckoutWrapper() {
  const navigate = useNavigate();
  const storedEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!storedEmail) {
      navigate('/login');
    }
  }, [storedEmail, navigate]);

  if (!storedEmail) return null;

  return <CheckoutForm email={storedEmail} onSuccess={() => navigate('/interface')} />;
}

function App() {
  return (
    <Elements stripe={stripePromise}>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/checkout" element={<CheckoutWrapper />} />
         <Route path="/ClipTuneGenerator" element={<ClipTuneGenerator/>} />
         <Route path="/SettingsPage" element={<SettingsPage/>} />
        </Routes>
      </Router>
    </Elements>
  );
}

export default App;
