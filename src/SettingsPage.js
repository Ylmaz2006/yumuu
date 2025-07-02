import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "./SettingsPage.css";

function SettingsPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [accountType, setAccountType] = useState("Loading..."); // This will hold 'Premium' or 'Free'
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
        // Step 1: Fetch user details (username, email)
        const userResponse = await fetch("http://localhost:5000/get-user", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({email: userIdentifier}),
        });

        if (!userResponse.ok) throw new Error("Failed to fetch user data");
        const userData = await userResponse.json();
        setUsername(userData.username || "N/A");
        setEmail(userData.email);

        // Step 2: Fetch the account status directly from the backend
        // The backend will check the 'paymentStatus' field in the database
        const paymentResponse = await fetch("http://localhost:5000/check-payment-status", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({email: userIdentifier}),
        });

        if (!paymentResponse.ok) throw new Error("Failed to verify account status");

        const paymentData = await paymentResponse.json();
        // The backend sends { accountType: 'Premium' } or { accountType: 'Free' }
        // We use that directly to set the state.
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
  }, []); // Runs once on component mount

  const handleCreateClick = () => navigate("/interface");
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
          {/* This badge now correctly reflects the paymentStatus from the database */}
          <div className={`account-badge ${accountType?.toLowerCase()}`}>
            {isLoading ? "Loading..." : `${accountType} Account`}
          </div>
        </div>

        <section className="settings-section">
          <h2>Profile</h2>
          <p>Edit your profile details below.</p>
        </section>

        {/* This conditional section will show if the user's status is 'Free' */}
        {accountType === "Free" && !isLoading && (
          <section className="settings-section upgrade-section">
            <h2>Upgrade to Premium</h2>
            <p>Unlock unlimited music generation and commercial licenses by upgrading.</p>
            <button className="save-btn" onClick={() => navigate("/checkout")}>Upgrade Now</button>
          </section>
        )}
      </main>
    </div>
  );
}

export default SettingsPage;
