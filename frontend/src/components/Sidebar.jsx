import React from "react";
import {
  FaTachometerAlt,
  FaServicestack,
  FaCalendarAlt,
  FaSignOutAlt,
  FaUser,
  FaCommentDots, // ✅ Import feedback icon
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // Import CSS for styling

const Sidebar = () => {
  return (
    <nav className="sidebar open"> {/* Sidebar is always open */}
      
      {/* Logo at the top */}
      <div className="sidebar-logo">
        <img src="/logo.png" alt="Logo" className="logo" />
      </div>

      {/* Sidebar Menu */}
      <ul>
        <li>
          <Link to="/home">
            <FaTachometerAlt className="icon" />
            Home
          </Link>
        </li>
        <li>
          <Link to="/services">
            <FaServicestack className="icon" />
            Services
          </Link>
        </li>
        <li>
          <Link to="/meetings">
            <FaCalendarAlt className="icon" />
            Meeting Scheduler 
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <FaUser className="icon" />
            Profile
          </Link>
        </li>
        <li>
          <Link to="/feedbackForm"> {/* ✅ Feedback route */}
            <FaCommentDots className="icon" />
            Feedback
          </Link>
        </li>
        <li>
          <Link to="/logout">
            <FaSignOutAlt className="icon" />
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
