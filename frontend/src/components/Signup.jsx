// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import "./AuthForm.css"; // Import the CSS for styling

// const SignUp = () => {
//   const [userDetails, setUserDetails] = useState({
//     username: "",
//     email: "",
//     password: ""
//   });

//   const handleChange = (e) => {
//     setUserDetails({
//       ...userDetails,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch('http://localhost:5000/api/auth/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(userDetails),
//       });
  
//       const data = await res.json();
//       if (res.ok) {
//         alert(data.message); // ✅ Show success message
//         setUserDetails({ username: '', email: '', password: '' }); // Reset form
//       } else {
//         alert(data.message || 'Signup failed');
//       }
//     } catch (error) {
//       console.error(error);
//       alert('Signup error');
//     }
//   };
  

//   return (
    
//     <div className="auth-container">
//       <form className="auth-form" onSubmit={handleSubmit}>
//         <h2>Sign up</h2>
//         <input
//           type="text"
//           name="username"
//           className="input-field"
//           placeholder="Username"
//           value={userDetails.username}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="email"
//           name="email"
//           className="input-field"
//           placeholder="Email"
//           value={userDetails.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           className="input-field"
//           placeholder="Password"
//           value={userDetails.password}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit" className="btn-submit">Sign Up</button>
//         <p className="switch-link">
//           Already have an account? <Link to="/login">Login</Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default SignUp;


import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AuthForm.css";

const SignUp = () => {
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://mockinterview-2-gxs9.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userDetails),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setUserDetails({ username: "", email: "", password: "" });
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error(error);
      alert("Signup error");
    }
  };

  return (
    <div
      style={{
        backgroundImage:
          "url(https://i.pinimg.com/736x/d4/12/5e/d4125e7364b0297bf5517a8e11cd8398.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Sign up</h2>
          <input
            type="text"
            name="username"
            className="input-field"
            placeholder="Username"
            value={userDetails.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            className="input-field"
            placeholder="Email"
            value={userDetails.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            className="input-field"
            placeholder="Password"
            value={userDetails.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-submit">
            Sign Up
          </button>
          <p className="switch-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
