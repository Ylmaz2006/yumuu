import React, {useState} from "react";
import "./LandingPage.css";
import {useNavigate} from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const [animateLogo, setAnimateLogo] = useState(false);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleLogoClick = () => {
    setAnimateLogo(true);
    setTimeout(() => setAnimateLogo(false), 1000);
  };

  return (
    <div className="landing-container">
      <div className="background-layers">
        <div className="wave-layer"></div>
        <div className="wave-layer"></div>
        <div className="wave-layer"></div>
      </div>

      <div className="content-wrapper">
        <div className="logo" onClick={handleLogoClick}>
          <div className={`logo-circle ${animateLogo ? "logo-bounce" : ""}`}>
            <div className="logo-inner">🎵</div>
          </div>
        </div>

        <h1 className="headline">SoundAI</h1>
        <p className="subheadline">
          Transform your YouTube videos with AI-powered music that perfectly matches your content.
          Create stunning soundtracks in seconds, not hours.
        </p>

        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">🎬</div>
            <div className="feature-title">YouTube Ready</div>
            <div className="feature-desc">Optimized tracks for any video style</div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⚡</div>
            <div className="feature-title">Lightning Fast</div>
            <div className="feature-desc">Generate music in under 30 seconds</div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🎨</div>
            <div className="feature-title">Style Match</div>
            <div className="feature-desc">AI analyzes your content for perfect fit</div>
          </div>
        </div>

        <div className="button-group">
          <button className="btn btn-primary" onClick={handleLogin}>Start Creating</button>
          <button className="btn btn-secondary" onClick={handleSignup}>Watch Demo</button>
        </div>

        <div className="sound-waves">
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
