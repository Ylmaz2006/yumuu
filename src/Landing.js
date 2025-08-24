import React, { useState } from "react";
import "./LandingPage.css"
import { useNavigate } from "react-router-dom";
const Landing = () => {
  const navigate = useNavigate();
  const [animateLogo, setAnimateLogo] = useState(false);
 const handleLogin = () => navigate("/login");
  const handleStart = () => {
    // Navigate to login or main app
    console.log("Starting ClipTuner AI...");
  };

  const handleLogoClick = () => {
    setAnimateLogo(true);
    setTimeout(() => setAnimateLogo(false), 1000);
  };

  return (
    <div className="landing-container">
      <div className="content-wrapper">
        
        {/* Logo Section */}
        <div className="logo" onClick={handleLogoClick}>
          <div className={`logo-circle ${animateLogo ? 'logo-bounce' : ''}`}>
            <div className="logo-inner">
              <svg 
                className="logo-inner svg" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="headline">
          <span className="cliptuner-text">ClipTuner</span>
          <span className="ai-text">AI</span>
        </h1>

        {/* Subtitle */}
        <p className="subheadline">
          Generate music for your video selection by its content
        </p>

        {/* CTA Button */}
        <div className="button-group">
          <button 
            onClick={handleLogin}
            className="btn btn-primary"
          >
            Start Creating
          </button>
        </div>

        {/* Additional Info */}
        <div className="additional-info">
          <p>No credit card required • Generate unlimited tracks • Export in multiple formats
            For Business inquiries, contact us at this email:drademademogullari@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;