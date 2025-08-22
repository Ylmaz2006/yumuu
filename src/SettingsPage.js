import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import PaymentMethods from "./PaymentMethods.js"; // Import the new component
import "./SettingsPage.css";

function SettingsPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [accountType, setAccountType] = useState("Loading...");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("subscription"); // Changed default tab

  useEffect(() => {
    const fetchUserDataAndStatus = async () => {
      const userIdentifier = localStorage.getItem("userEmail");
      if (!userIdentifier) {
        setError("No user email found. Please log in again.");
        setIsLoading(false);
        return;
      }

      try {
        // Fetch user details
        const userResponse = await fetch("http://localhost:3001/get-user", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({email: userIdentifier}),
        });
        
        if (!userResponse.ok) {
          const errorText = await userResponse.text();
          console.error('User fetch error:', errorText);
          throw new Error("Failed to fetch user data");
        }
        
        const userData = await userResponse.json();
        setUsername(userData.username || "N/A");
        setEmail(userData.email);
        localStorage.setItem("userId", userData.userId);

        // Fetch account status
        const paymentResponse = await fetch("http://localhost:3001/check-payment-status", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({email: userIdentifier}),
        });
        
        if (!paymentResponse.ok) {
          const errorText = await paymentResponse.text();
          console.error('Payment status error:', errorText);
          throw new Error("Failed to verify account status");
        }
        
        const paymentData = await paymentResponse.json();
        setAccountType(paymentData.accountType);
        
      } catch (err) {
        console.error("Error loading settings page:", err);
        setError("Could not load user profile. Please try again later.");
        setAccountType("Error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDataAndStatus();
  }, []);

  const handleUpgradeClick = async () => {
    const userIdentifier = localStorage.getItem("userEmail");
    setUpgradeLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Starting upgrade process for:', userIdentifier);
      
      // Check if user has a credit card on file
      const cardCheckResponse = await fetch("http://localhost:3001/check-credit-card", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email: userIdentifier}),
      });
      
      if (!cardCheckResponse.ok) {
        const errorText = await cardCheckResponse.text();
        console.error('Credit card check failed:', errorText);
        throw new Error(`Failed to check payment methods (${cardCheckResponse.status})`);
      }
      
      const cardData = await cardCheckResponse.json();
      console.log('💳 Credit card check result:', cardData);
      
      if (cardData.hasCreditCard) {
        // If they have a card, try to upgrade them directly
        console.log('✅ User has payment method, attempting direct upgrade...');
        
        const upgradeResponse = await fetch("http://localhost:3001/upgrade-to-premium", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({email: userIdentifier}),
        });
        
        if (!upgradeResponse.ok) {
          const errorText = await upgradeResponse.text();
          console.error('Upgrade failed:', errorText);
          throw new Error(`Upgrade failed (${upgradeResponse.status})`);
        }
        
        const upgradeData = await upgradeResponse.json();
        console.log('🎉 Upgrade successful:', upgradeData);
        
        setAccountType("Premium");
        alert("🎉 Successfully upgraded to Premium!");
        
      } else {
        // If no card, suggest adding one in the Payment Methods tab
        console.log('💳 No payment method found, directing to payment methods...');
        alert("You need to add a payment method first. Please go to the Payment Methods tab to add a credit card.");
        setActiveTab("payments"); // Switch to payments tab
      }
      
    } catch (err) {
      console.error("❌ Upgrade failed:", err);
      setError(`Upgrade failed: ${err.message}`);
      alert(`Upgrade failed: ${err.message}`);
    } finally {
      setUpgradeLoading(false);
    }
  };

  const handleCancelPremium = async () => {
    if (!window.confirm("Are you sure you want to cancel your Premium subscription? You'll lose access to premium features.")) {
      return;
    }
    
    const userIdentifier = localStorage.getItem("userEmail");
    setCancelLoading(true);
    setError(null);
    
    try {
      console.log('🚫 Canceling premium for:', userIdentifier);
      
      const cancelResponse = await fetch("http://localhost:3001/cancel-premium", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email: userIdentifier}),
      });
      
      if (!cancelResponse.ok) {
        const errorText = await cancelResponse.text();
        console.error('Cancellation failed:', errorText);
        throw new Error(`Cancellation failed (${cancelResponse.status})`);
      }
      
      const cancelData = await cancelResponse.json();
      console.log('✅ Cancellation successful:', cancelData);
      
      setAccountType("Free");
      alert("Your Premium subscription has been canceled. You now have a Free account.");
      
    } catch (err) {
      console.error("❌ Cancellation failed:", err);
      setError(`Cancellation failed: ${err.message}`);
      alert(`Cancellation failed: ${err.message}`);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleCreateClick = () => navigate("/ClipTuneGenerator");
  const handleSettingsClick = () => navigate("/settings");
  const handleLibraryClick = () => navigate("/library");

  const renderTabContent = () => {
    switch (activeTab) {
      case "subscription":
        return (
          <>
            {/* Section for Free users to upgrade */}
            {accountType === "Free" && !isLoading && (
              <section className="settings-section upgrade-section">
                <h2>🚀 Upgrade to Premium</h2>
                <p>Unlock unlimited music generation and commercial licenses by upgrading to Premium.</p>
                <div className="premium-features">
                  <ul>
                    <li>✨ Unlimited AI music generation</li>
                    <li>🎵 High-quality audio exports</li>
                    <li>📄 Commercial license for YouTube</li>
                    <li>🚀 Priority support</li>
                    <li>🔧 Advanced editing features</li>
                    <li>💾 Extended storage</li>
                  </ul>
                </div>
                <button 
                  className={`save-btn ${upgradeLoading ? 'loading' : ''}`}
                  onClick={handleUpgradeClick}
                  disabled={upgradeLoading}
                >
                  {upgradeLoading ? "Upgrading..." : "Upgrade to Premium - $10/month"}
                </button>
                <p className="upgrade-note">
                  💡 <strong>Tip:</strong> Add a payment method in the "Payment Methods" tab first for faster checkout.
                </p>
              </section>
            )}

            {/* Section for Premium users to manage their subscription */}
            {accountType === "Premium" && !isLoading && (
              <section className="settings-section premium-section">
                <h2>🎉 Premium Subscription</h2>
                <p>You are currently on the <strong>Premium</strong> plan!</p>
                <div className="premium-status">
                  <p>✅ Unlimited music generation</p>
                  <p>✅ Commercial licensing included</p>
                  <p>✅ Priority support</p>
                  <p>✅ Advanced editing features</p>
                  <p>✅ Extended storage</p>
                </div>
                <button 
                  className={`cancel-btn ${cancelLoading ? 'loading' : ''}`}
                  onClick={handleCancelPremium}
                  disabled={cancelLoading}
                >
                  {cancelLoading ? "Canceling..." : "Cancel Subscription"}
                </button>
              </section>
            )}
          </>
        );

      case "payments":
        return <PaymentMethods />;

      case "security":
        return (
          <section className="settings-section">
            <h2>🔒 Security & Privacy</h2>
            <p>Manage your account security and privacy settings.</p>
            
            <div className="security-options">
              <div className="security-item">
                <h3>Password</h3>
                <p>Change your account password</p>
                <button className="secondary-btn">Change Password</button>
              </div>
              
              <div className="security-item">
                <h3>Two-Factor Authentication</h3>
                <p>Add an extra layer of security to your account</p>
                <button className="secondary-btn">Enable 2FA</button>
              </div>
              
              <div className="security-item">
                <h3>Login History</h3>
                <p>View recent login activity</p>
                <button className="secondary-btn">View History</button>
              </div>
              
              <div className="security-item">
                <h3>Data Export</h3>
                <p>Download a copy of your account data</p>
                <button className="secondary-btn">Export Data</button>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-page-container">
      <header className="top-nav">
        <div className="nav-buttons">
          <button className="nav-btn" onClick={handleCreateClick}>Create ✨</button>
          <button className="nav-btn active" onClick={handleSettingsClick}>Settings ⚙️</button>
          <button className="nav-btn" onClick={handleLibraryClick}>Library 📚</button>
        </div>
        <div className="user-info">
          {isLoading ? (
            <span>Loading...</span>
          ) : error ? (
            <span className="error-text">{error}</span>
          ) : (
            <>
              Logged in as: <strong>{username}</strong> ({email})
            </>
          )}
        </div>
      </header>

      <main className="settings-content">
        <div className="settings-header">
          <h1 className="settings-main-title">Account Settings</h1>
          <div className={`account-badge ${accountType?.toLowerCase()}`}>
            {isLoading ? "Loading..." : `${accountType} Account`}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <section className="settings-section error-section">
            <h2>Error</h2>
            <p className="error-message">{error}</p>
            <button 
              className="retry-btn" 
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </section>
        )}

        {/* Settings Tabs - Simplified */}
        <div className="settings-tabs">
          <button 
            className={`tab-btn ${activeTab === "subscription" ? "active" : ""}`}
            onClick={() => setActiveTab("subscription")}
          >
            💎 Profile & Subscription
          </button>
          <button 
            className={`tab-btn ${activeTab === "payments" ? "active" : ""}`}
            onClick={() => setActiveTab("payments")}
          >
            💳 Payment Methods
          </button>
          <button 
            className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            🔒 Security & Privacy
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}

export default SettingsPage;