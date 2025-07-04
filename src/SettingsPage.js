import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "./SettingsPage.css";

function SettingsPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [accountType, setAccountType] = useState("Loading...");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const userResponse = await fetch("http://localhost:5000/get-user", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({email: userIdentifier}),
        });
        if (!userResponse.ok) throw new Error("Failed to fetch user data");
        const userData = await userResponse.json();
        setUsername(userData.username || "N/A");
        setEmail(userData.email);

        // Fetch account status
        const paymentResponse = await fetch("http://localhost:5000/check-payment-status", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({email: userIdentifier}),
        });
        if (!paymentResponse.ok) throw new Error("Failed to verify account status");
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
    try {
      // Check if user has a credit card on file
      const res = await fetch("http://localhost:5000/check-credit-card", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email: userIdentifier}),
      });
      const data = await res.json();
      if (data.hasCreditCard) {
        // If they have a card, upgrade them to premium directly
        const upgradeRes = await fetch("http://localhost:5000/upgrade-to-premium", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({email: userIdentifier}),
        });
        if (!upgradeRes.ok) throw new Error("Failed to upgrade account");
        setAccountType("Premium"); // Update UI immediately
        alert("Upgraded to Premium successfully!");
      } else {
        // If no card, redirect to checkout to add one
        navigate("/checkout");
      }
    } catch (err) {
      console.error("Upgrade failed:", err);
      alert("Upgrade failed. Please try again.");
    }
  };

  const handleCancelPremium = async () => {
    const userIdentifier = localStorage.getItem("userEmail");
    if (window.confirm("Are you sure you want to cancel your Premium subscription?")) {
      try {
        const res = await fetch("http://localhost:5000/cancel-premium", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({email: userIdentifier}),
        });
        if (!res.ok) throw new Error("Failed to cancel subscription");
        setAccountType("Free"); // Update UI immediately
        alert("Your Premium subscription has been canceled.");
      } catch (err) {
        console.error("Cancellation failed:", err);
        alert("Cancellation failed. Please try again.");
      }
    }
  };


  const handleCreateClick = () => navigate("/ClipTuneGenerator");
  const handleSettingsClick = () => navigate("/settings");
  const handleLibraryClick = () => alert("Library clicked!");

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

        <section className="settings-section">
          <h2>Profile</h2>
          <p>Edit your profile details below.</p>
        </section>

        {/* Section for Free users to upgrade */}
        {accountType === "Free" && !isLoading && (
          <section className="settings-section upgrade-section">
            <h2>Upgrade to Premium</h2>
            <p>Unlock unlimited music generation and commercial licenses by upgrading.</p>
            <button className="save-btn" onClick={handleUpgradeClick}>Upgrade Now</button>
          </section>
        )}

        {/* Section for Premium users to manage their subscription */}
        {accountType === "Premium" && !isLoading && (
          <section className="settings-section">
            <h2>Subscription</h2>
            <p>You are currently on the Premium plan.</p>
            <button className="cancel-btn" onClick={handleCancelPremium}>Cancel Subscription</button>
          </section>
        )}
      </main>
    </div>
  );
}

export default SettingsPage;