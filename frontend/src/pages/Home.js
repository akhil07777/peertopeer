import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  // Check login status when page loads
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard"); // Skip landing page if already logged in
    }
  }, [navigate]);

  return (
    <div className="home">
      <div className="navbar">
        <h2 className="brand">
          SkillSwap <span>– P2P SkillExchanger</span>
        </h2>
      </div>

      <div className="hero">
        <h1>
          Exchange Skills.<br />
          <span>Grow Together.</span>
        </h1>

        <p>
          A peer-to-peer platform where passionate learners connect,
          collaborate, and level up together.
        </p>

        <div className="hero-buttons">
          <button className="primary" onClick={() => navigate("/register")}>
            Get Started
          </button>

          <button className="secondary" onClick={() => navigate("/login")}>
            Explore Community
          </button>
        </div>
      </div>

      <div className="features">
        <div className="card">
          <h3>Connect</h3>
          <p>Find like-minded learners instantly.</p>
        </div>

        <div className="card">
          <h3>Collaborate</h3>
          <p>Exchange real-world practical skills.</p>
        </div>

        <div className="card">
          <h3>Grow</h3>
          <p>Build your profile & reputation.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;