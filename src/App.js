import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Signup from './Signup';
import Landing from './Landing';
import VerifyEmail from './VerifyEmail';
import CheckoutForm from './CheckoutForm';
import './Login.css'; // Make sure this CSS file is correctly linked
import { auth, provider } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import SettingsPage from './SettingsPage';
import ClipTuneGenerator from './ClipTuneGenerator';
import LibraryPage from './LibraryPage';

import Auj from './Auj';
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
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('userEmail', email);
        setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
        setTimeout(() => navigate('/interface'), 1500); // Assuming '/interface' is your main app page
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

      const response = await fetch('http://https://backend-4-ag1u.onrender.com/google-login', {
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
            navigate('/settings'); // Or '/interface' if settings isn't a required stop
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
    <div className="login-page-container compact"> {/* Added 'compact' class for tighter spacing */}
      <div className="auth-card compact">
        <div className="auth-header compact">
          {/* A simple placeholder for a logo. You could replace this with an <img> tag. */}
          <div className="logo-placeholder compact"></div>
          <h1 className="auth-title compact">Welcome Back</h1>
          <p className="auth-subtitle compact">Sign in to your SoundAI account</p>
        </div>

        <form className="auth-form compact" onSubmit={handleLogin}>
          <div className="form-group compact">
            <label htmlFor="email" className="form-label compact">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your@email.com"
              className="form-input compact"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group compact">
            <label htmlFor="password" className="form-label compact">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="form-input compact"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
            <div className="forgot-password-link compact">
              <a href="#" onClick={e => { e.preventDefault(); handleForgotPassword(); }}>
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className={`primary-btn compact ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {/* The spinner will be managed by CSS, hidden by default */}
            <div className="spinner"></div>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          {message.text && (
            <div className={`message-box compact ${message.type}`}>
              {message.text}
            </div>
          )}
        </form>

        <div className="separator compact">
          <span className="separator-text">OR</span>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="google-auth-btn compact"
          disabled={loading}
        >
          <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google logo" className="google-icon" />
          Continue with Google
        </button>

        <div className="create-account-prompt compact">
          <p>Don't have an account? <span className="highlight">Join thousands of creators using AI.</span></p>
          <button className="secondary-btn compact" onClick={handleSignup} disabled={loading}>
            Create Account
          </button>
        </div>

        <div className="back-home-link compact">
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
          <Route path="/library" element={<LibraryPage />} />
       <Route path="/Auj" element={<Auj />} />
        </Routes>
      </Router>
    </Elements>
  );
}

export default App;