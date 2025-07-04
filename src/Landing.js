import React, { useState } from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const [animateLogo, setAnimateLogo] = useState(false);

  const handleLogin = () => navigate("/login");
  const handleSignup = () => navigate("/signup");

  const handleLogoClick = () => {
    setAnimateLogo(true);
    setTimeout(() => setAnimateLogo(false), 1000);
  };

  return (
    <div className="landing-container">
      <div className="content-wrapper">
        <div className="logo" onClick={handleLogoClick}>
          <div className={`logo-circle ${animateLogo ? "logo-bounce" : ""}`}>
            <div className="logo-inner">🎵</div>
          </div>
        </div>

        <h1 className="headline">SoundAI</h1>
        <p className="subheadline">AI-generated soundtracks for your YouTube videos</p>

        <div className="features-grid compact">
          <div className="feature-item">
            <div className="feature-icon">🎬</div>
            <div className="feature-title">YouTube Ready</div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⚡</div>
            <div className="feature-title">Fast Generation</div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🎨</div>
            <div className="feature-title">Style Matching</div>
          </div>
        </div>

        <div className="button-group">
          <button className="btn btn-primary" onClick={handleLogin}>Start</button>
          <button className="btn btn-secondary" onClick={handleSignup}>Demo</button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
