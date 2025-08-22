import React, {useState, useEffect} from "react";
import "./Signup.css";
import {loadStripe} from "@stripe/stripe-js";
import {Elements, CardElement, useStripe, useElements} from "@stripe/react-stripe-js";
import {useNavigate} from "react-router-dom";

// Make sure your Stripe publishable key is correct
const stripePromise = loadStripe("pk_test_51ReQRi2MPLgaUEDUiPlGBf9YtJoq1caYHQLV95Z0vbHvPQoDaDUc2fic72lNqCYcLNdNRKvzSroRKdgoJoR7Yzxz00555fGeyp");

const SignupForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [showPremiumForm, setShowPremiumForm] = useState(false);

  // Debug logging
  console.log("SignupForm render - showPremiumForm:", showPremiumForm, "loading:", loading);

  // Fetch a payment intent when premium form is shown
  useEffect(() => {
    if (showPremiumForm) {
      console.log("Loading payment intent for premium form...");
      setLoading(true);
      setMessage("");
      setStatus("");
      
      fetch("https://nback-6gqw.onrender.com/create-payment-intent", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
      })
          .then((res) => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
            console.log("Payment intent created:", data.clientSecret ? "✅" : "❌");
            setClientSecret(data.clientSecret);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Payment intent error:", error);
            setMessage("Failed to initialize payment form. Please try again.");
            setStatus("error");
            setLoading(false);
          });
    }
  }, [showPremiumForm]);

  // --- UPDATED: Handles premium signup with payment ---
  const handlePremiumSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setMessage("Please enter email and password.");
      setStatus("error");
      return;
    }
    
    if (!stripe || !elements) {
      setMessage("Payment system is not ready yet. Please wait a moment and try again.");
      setStatus("error");
      return;
    }
    
    // If clientSecret is not ready, try to wait a bit or show a different message
    if (!clientSecret) {
      setMessage("Payment is still initializing. Please wait a moment and try again.");
      setStatus("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setStatus("");

    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      console.log("Confirming payment...");

      // First, confirm the payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: email,
          },
        },
      });

      if (result.error) {
        console.error("Payment error:", result.error);
        setMessage(result.error.message || "Payment failed. Please try again.");
        setStatus("error");
        setLoading(false);
        return;
      }

      // If payment is successful, then create the user account as 'Premium'
      if (result.paymentIntent.status === "succeeded") {
        console.log("Payment succeeded, creating account...");

        const signupRes = await fetch("https://nback-6gqw.onrender.com/signup", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            email,
            password,
            paymentIntentId: result.paymentIntent.id, // Pass the ID to the backend
          }),
        });

        const data = await signupRes.json();
        if (signupRes.ok) {
          setMessage("Premium account created successfully! Please check your email to verify.");
          setStatus("success");
        } else {
          setMessage(data.message || "Account creation failed after payment.");
          setStatus("error");
        }
      } else {
        setMessage(`Payment status: ${result.paymentIntent.status}. Please try again.`);
        setStatus("error");
      }
    } catch (error) {
      console.error("Premium signup error:", error);
      setMessage("An error occurred during premium signup. Please try again.");
      setStatus("error");
    }

    setLoading(false);
  };

  // --- Handles free signup without payment ---
  const handleFreeSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Please enter email and password to create a free account.");
      setStatus("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const signupRes = await fetch("https://nback-6gqw.onrender.com/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password}), // No payment ID is sent
      });

      const data = await signupRes.json();
      if (signupRes.ok) {
        setMessage("Free account created! Please check your email to verify.");
        setStatus("success");
      } else {
        setMessage(data.message || "Free account creation failed.");
        setStatus("error");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setStatus("error");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="signup-wrapper">
        <div className="header">
          <div className="logo"></div>
          <h1 className="title">Join SoundAI</h1>
          <p className="subtitle">Start creating AI-powered music for your videos</p>
        </div>

        {!showPremiumForm ? (
          // Free Account Form (Default View)
          <form onSubmit={handleFreeSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="form-input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                disabled={loading}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Create Password</label>
              <input 
                type="password" 
                id="password" 
                className="form-input" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                disabled={loading}
                placeholder="Create a secure password"
              />
            </div>

            <div className="divider">Free Plan - No Credit Card Required</div>

            <ul className="features-list">
              <li>5 AI music generations per month</li>
              <li>Standard quality audio exports</li>
              <li>Personal use license</li>
            </ul>

            <button 
              className={`submit-btn free-account-btn ${loading ? "loading" : ""}`} 
              type="submit" 
              disabled={loading}
            >
              <span className="loading-spinner"></span>
              {loading ? "Creating Account..." : "Create Free Account"}
            </button>

            <div className="plan-options">
              <div className="divider">Or upgrade to Premium</div>
              
              <button 
                type="button" 
                className="premium-upgrade-btn" 
                onClick={() => {
                  console.log("Premium button clicked - switching to premium form...");
                  setShowPremiumForm(true);
                  setMessage("");
                  setStatus("");
                }}
                disabled={loading}
              >
                Upgrade to Premium - $10/month
              </button>
            </div>

            {message && <div className={`message ${status}`}>{message}</div>}
          </form>
        ) : (
          // Premium Account Form - Compact Layout
          <form onSubmit={handlePremiumSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label className="form-label" htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="form-input" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  disabled={loading}
                  style={{ padding: '12px' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0' }}>
                <label className="form-label" htmlFor="password">Create Password</label>
                <input 
                  type="password" 
                  id="password" 
                  className="form-input" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  disabled={loading}
                  style={{ padding: '12px' }}
                />
              </div>
            </div>

            <div className="divider" style={{ margin: '12px 0' }}>Premium Plan - $10/month</div>

            <ul className="features-list" style={{ margin: '12px 0', padding: '12px', fontSize: '12px' }}>
              <li style={{ marginBottom: '6px' }}>Unlimited AI music generation & high-quality exports</li>
              <li style={{ marginBottom: '6px' }}>Commercial license for YouTube & priority support</li>
              <li style={{ marginBottom: '6px' }}>Advanced fade algorithms & custom timing</li>
              <li style={{ marginBottom: '0' }}>Priority processing & faster generation</li>
            </ul>

            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label">Credit Card Details</label>
              {!clientSecret ? (
                <div className="card-loading" style={{ padding: '8px' }}>
                  <div className="loading-message">Initializing payment...</div>
                </div>
              ) : (
                <>
                  <div className="card-element-container" style={{ padding: '8px' }}>
                    <CardElement 
                      className="card-element" 
                      options={{
                        disabled: loading,
                        style: {
                          base: {
                            fontSize: '14px',
                            color: '#ffffff',
                            '::placeholder': {
                              color: '#a1a1aa',
                            },
                          },
                          invalid: {
                            color: '#dc2626',
                          },
                        }
                      }} 
                    />
                  </div>
                  <div className="security-badge" style={{ marginTop: '4px' }}>
                    <span>🔒 Secured by Stripe</span>
                  </div>
                </>
              )}
            </div>

            <button 
              className={`submit-btn ${loading ? "loading" : ""}`} 
              type="submit" 
              disabled={loading || !stripe || !email || !password}
              style={{ width: '100%', marginBottom: '10px', padding: '14px 20px' }}
            >
              <span className="loading-spinner"></span>
              {loading ? "Processing Payment..." : 
               !stripe ? "Loading Payment System..." : 
               !email || !password ? "Enter Email & Password" :
               !clientSecret ? "Initializing Payment..." : 
               "Start Premium Subscription - $10"}
            </button>

            <button 
              type="button" 
              className="secondary-btn" 
              onClick={() => {
                console.log("Switching back to free form...");
                setShowPremiumForm(false);
                setClientSecret("");
                setMessage("");
                setStatus("");
              }}
              disabled={loading}
              style={{ width: '100%', padding: '12px 20px', marginTop: '0' }}
            >
              ← Back to Free Account
            </button>

            {message && <div className={`message ${status}`} style={{ marginTop: '8px' }}>{message}</div>}
          </form>
        )}

        <div className="back-link">
          <a href="#" onClick={() => navigate("/login")}>← Already have an account? Sign In</a>
        </div>
      </div>
    </div>
  );
};

// Main component remains the same
const Signup = () => (
  <Elements stripe={stripePromise}>
    <SignupForm />
  </Elements>
);

export default Signup;