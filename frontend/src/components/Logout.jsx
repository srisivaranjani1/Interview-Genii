import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate clearing authentication data
    localStorage.removeItem("user");
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  }, [navigate]);

  return (
    <div className="page-container">
      <h2>Logging Out...</h2>
      <p>You will be redirected to the login page shortly.</p>
    </div>
  );
};

export default Logout;
