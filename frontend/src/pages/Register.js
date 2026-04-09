import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Auth.css";

function Register() {
  const navigate = useNavigate();

const [form, setForm] = useState({
  name: "",
  email: "",
  password: ""
});

const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value // ❌ remove trim here
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/users/register", form);

    alert(res.data.message || "Registration Successful 🚀");

    navigate("/login");

  } catch (error) {
    console.log("FULL ERROR:", error);
    console.log("BACKEND RESPONSE:", error.response);

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    alert(message);
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
         
         <input
  name="name"
  placeholder="Name"
  onChange={handleChange}
  required
/>

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