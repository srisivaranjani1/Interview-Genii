import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="navbar">
        <div className="logo-text">INTERVIEW GENII</div>
        <div className="auth-buttons">
          <Link to="/signup"><button className="btn">Sign Up</button></Link>
          <Link to="/login"><button className="btn">Login</button></Link>
        </div>
      </header>

      <section className="content">
        <div className="text-content">
          <h1><span className="highlight">Ace Your Interviews</span> With US</h1>
          <p>
          INTERVIEW GENII is your AI-powered interview coach, built to take the guesswork out of interview prep. With smart mock sessions that feel just like the real thing, you’ll receive instant, tailored feedback on your answers, tone, and confidence. Whether you're gearing up for your first job or your next big leap, INTERVIEW GENII helps you practice smarter, speak sharper, and stand out every single time.
          </p>
          
        </div>
        <div className="image-content">
          <img
            src="/interview.jpg"
            alt="Interview Illustration"
          />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;