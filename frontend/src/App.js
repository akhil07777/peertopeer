import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Requests from "./pages/Requests";
import Connections from "./pages/Connections";
import AdminDashboard from "./pages/AdminDashboard";

function PrivateRoute({ children }) {

const token = localStorage.getItem("token");

return token ? children : <Navigate to="/login" />;

}

function AdminRoute({ children }) {

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token) {
return <Navigate to="/login" />;
}

if (user?.role !== "admin") {
return <Navigate to="/dashboard" />;
}

return children;

}

function App() {

return (
  <Router>

  <Routes>

    <Route path="/" element={<Home />} />

    <Route path="/login" element={<Login />} />

    <Route path="/register" element={<Register />} />

    <Route path="/connections" element={<Connections />} />



    {/* ADMIN ROUTE */}

    <Route
      path="/admin"
      element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      }
    />



    {/* USER DASHBOARD */}

    <Route
      path="/dashboard"
      element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      }
    />



    <Route path="/profile" element={<Profile />} />



    <Route
      path="/requests"
      element={
        <PrivateRoute>
          <Requests />
        </PrivateRoute>
      }
    />

  </Routes>

</Router>
);

}

export default App;