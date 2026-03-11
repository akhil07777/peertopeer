import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Auth.css";

function Register() {
  const navigate = useNavigate();

 const [form, setForm] = useState({
  email: "",
  password: ""
});

 const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value.trim()
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/users/register", form);
      alert("Registration Successful 🚀");
      navigate("/login");
    } catch (error) {
      alert("Registration Failed");
    }
  };
  

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
         

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit">Register</button>
        </form>

        <p className="switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;