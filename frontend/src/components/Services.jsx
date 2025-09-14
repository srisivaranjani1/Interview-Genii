import React from "react";
import "./Services.css";
import { FaFileUpload, FaBrain, FaVideo, FaCalendarAlt, FaCheckCircle, FaChartLine } from "react-icons/fa";

const Services = () => {
  return (
    <section className="services-section">
      <div className="container">
        {/* Intro / Header Section */}
        <div className="services-intro">
          <div className="services-content">
            <h2>Our Services</h2>
            <p>
              Empower your interview journey with cutting-edge AI-driven tools that helps to analyze performance, and help you improve continuously.
            </p>
            <button className="explore-btn">Explore All Our Services</button>
          </div>
          <div className="services-image">
            {/* Optional illustration/image */}
          </div>
        </div>

        {/* Services Grid */}
        <div className="services-grid">
          <div className="service-card">
            <FaFileUpload className="service-icon" />
            <h3>Resume Upload & Analysis</h3>
            <p>Upload your resume and get AI-generated interview questions based on your projects mentioned in resume.</p>
          </div>

          <div className="service-card">
            <FaBrain className="service-icon" />
            <h3>Domain-Based Questions</h3>
            <p>Select your domain (Full Stack, MERN, etc.) and practice tailored technical questions.</p>
          </div>

          <div className="service-card">
            <FaVideo className="service-icon" />
            <h3>Face & Emotion Recognition</h3>
            <p>Get real-time emotion analysis to track your confidence and body language.</p>
          </div>

          <div className="service-card">
            <FaCalendarAlt className="service-icon" />
            <h3>Meeting Scheduler</h3>
            <p>Plan your daily task and get remainder notifications.</p>
          </div>

          <div className="service-card">
            <FaCheckCircle className="service-icon" />
            <h3>Grammar & Communication Check</h3>
            <p>AI-powered grammar correction.</p>
          </div>

          <div className="service-card">
            <FaChartLine className="service-icon" />
            <h3>Real-Time Dashboard</h3>
            <p>Track progress and monitor improvements after every session.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
