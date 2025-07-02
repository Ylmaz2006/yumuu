import React, {useState, useEffect} from "react";
import {CardElement, useStripe, useElements} from "@stripe/react-stripe-js";
import {useNavigate} from "react-router-dom";
import "./Signup.css"; // Reuse the signup CSS for a consistent look

const CheckoutForm = ({email, onSuccess}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  // Get a payment intent from the backend when the form loads
  useEffect(() => {
    fetch("http://localhost:5000/create-payment-intent", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
    })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            setMessage("Could not initialize payment.");
            setStatus("error");
          }
        })
        .catch(() => {
          setMessage("Failed to initialize payment form.");
          setStatus("error");
        });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) {
      setMessage("Payment form is not ready. Please wait a moment and try again.");
      setStatus("error");
      return;
    }
    setLoading(true);

    // Confirm the payment with Stripe
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {email},
      },
    });

    if (result.error) {
      setMessage(result.error.message);
      setStatus("error");
      setLoading(false);
      return;
    }

    // If payment succeeds, call the dedicated '/complete-checkout' endpoint
    if (result.paymentIntent.status === "succeeded") {
      const response = await fetch("http://localhost:5000/complete-checkout", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          email,
          paymentIntentId: result.paymentIntent.id,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Success! Your account is now Premium. Redirecting...");
        setStatus("success");
        setTimeout(() => onSuccess(), 2000); // Call the success handler from props
      } else {
        // This is the error you were seeing
        setMessage(`Payment succeeded, but saving failed: ${data.message}`);
        setStatus("error");
      }
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="signup-wrapper">
        <div className="header">
          <h1 className="title">Complete Your Purchase</h1>
          <p className="subtitle">You're one step away from your Premium account.</p>
          <div className="price-badge">Premium Plan - $10/month</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" value={email} disabled />
          </div>

          <div className="divider">Payment Information</div>

          <div className="form-group">
            <label className="form-label">Credit Card Details</label>
            <div className="card-element-container">
              <CardElement className="card-element" />
            </div>
          </div>

          <button className={`submit-btn ${loading ? "loading" : ""}`} type="submit" disabled={loading || !stripe}>
            {loading ? "Processing..." : "Confirm Payment - $10"}
          </button>

          {message && <div className={`message ${status}`}>{message}</div>}
        </form>
        <div className="back-link">
          <a href="#" onClick={() => navigate("/settings")}>← Maybe Later</a>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
