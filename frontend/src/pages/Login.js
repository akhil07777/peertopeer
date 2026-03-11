import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Auth.css";

function Login() {

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

      const res = await api.post("/users/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      /* Redirect based on role */

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } 
      else {
        navigate("/dashboard");
      }

    } catch (error) {

      if (error.response?.data?.message === "User not found") {

        alert("Account not found. Please register first.");
        navigate("/register");

      } 
      else if (error.response?.data?.message === "Wrong password") {

        alert("Incorrect password. Please try again.");

      } 
      else {

        alert("Something went wrong. Try again.");

      }

    }

  };

  return (

    <div className="auth-container">

      <div className="auth-card">

        <h2>Login to SkillSwap</h2>

        <form onSubmit={handleSubmit} autoComplete="off">

          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="off"
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>

        </form>

        <p className="switch">
          New User?{" "}
          <span onClick={() => navigate("/register")}>
            Create Account
          </span>
        </p>

      </div>

    </div>

  );

}

export default Login;