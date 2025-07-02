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

  // Fetch a payment intent when the component loads
  useEffect(() => {
    fetch("http://localhost:5000/create-payment-intent", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
    })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch(() => {
          setMessage("Failed to initialize payment form");
          setStatus("error");
        });
  }, []);

  // --- UPDATED: Handles premium signup with payment ---
  const handlePremiumSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) {
      setMessage("Payment form is not ready yet.");
      setStatus("error");
      return;
    }

    setLoading(true);
    setMessage("");

    const cardElement = elements.getElement(CardElement);

    // First, confirm the payment with Stripe
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {email},
      },
    });

    if (result.error) {
      setMessage(result.error.message);
      setStatus("error");
      setLoading(false);
      return;
    }

    // If payment is successful, then create the user account as 'Premium'
    if (result.paymentIntent.status === "succeeded") {
      const signupRes = await fetch("http://localhost:5000/signup", {
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
        setMessage("Premium account created! Please check your email to verify.");
        setStatus("success");
      } else {
        setMessage(data.message || "Account creation failed after payment.");
        setStatus("error");
      }
    } else {
      setMessage("Payment not completed.");
      setStatus("error");
    }

    setLoading(false);
  };

  // --- NEW: Handles free signup without payment ---
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
      const signupRes = await fetch("http://localhost:5000/signup", {
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

        {/* The form now has a specific onSubmit for premium signup */}
        <form onSubmit={handlePremiumSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input type="email" id="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Create Password</label>
            <input type="password" id="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
          </div>

          <div className="divider">Premium Plan - $10/month</div>

          <ul className="features-list">
            <li>Unlimited AI music generation & high-quality exports</li>
            <li>Commercial license for YouTube & priority support</li>
          </ul>

          <div className="form-group">
            <label className="form-label">Credit Card Details</label>
            <div className="card-element-container">
              <CardElement className="card-element" options={{disabled: loading}} />
            </div>
            <div className="security-badge">
              <span>🔒 Secured by Stripe</span>
            </div>
          </div>

          <button className={`submit-btn ${loading ? "loading" : ""}`} type="submit" disabled={loading || !stripe}>
            {loading ? "Processing..." : "Start Premium Subscription - $10"}
          </button>

          {/* New button for free signup */}
          <button type="button" className="secondary-btn" onClick={handleFreeSubmit} disabled={loading}>
            Skip and Create Free Account
          </button>

          {message && <div className={`message ${status}`}>{message}</div>}
        </form>

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
