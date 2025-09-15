import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import LandingPage from "./components/LandingPage";
import SignUp from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import FeedbackForm from "./components/FeedbackForm";
import Services from "./components/Services";
import Meetings from "./components/Meetings";
import Logout from "./components/Logout";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";

import "./App.css";

// Layout wrapper to control sidebar visibility and layout styling
const Layout = ({ children }) => {
  const location = useLocation();
  const hideSidebarRoutes = ["/", "/login", "/signup"];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="app-container" style={{ display: "flex" }}>
      {!shouldHideSidebar && <Sidebar />}
      <div
        className="main-content"
        style={{
          width: shouldHideSidebar ? "100%" : "calc(100% - 250px)",
          marginLeft: shouldHideSidebar ? "0" : "250px",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        {/* 🔹 Removed the top-right user icon */}
        {children}
      </div>
    </div>
  );
};

// Wrapper to apply layout to routes
const AppRoutes = () => {
  const location = useLocation();

  return (
    <Layout>
      <Routes location={location}>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />

        {/* Protected/Internal Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/feedbackForm" element={<FeedbackForm />} />
        <Route path="/services" element={<Services />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
