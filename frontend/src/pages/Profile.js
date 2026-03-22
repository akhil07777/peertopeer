import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    skillsOffered: "",
    skillsWanted: "",
    hobbies: "",
    bio: ""
  });

  const [message, setMessage] = useState("");

  /* -------------------- LOAD PROFILE DATA -------------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setForm({
          name: res.data.name || "",
          skillsOffered: res.data.skillsOffered || "",
          skillsWanted: res.data.skillsWanted || "",
          hobbies: res.data.hobbies || "",
          bio: res.data.bio || ""
        });

      } catch (error) {
        console.log("Error loading profile:", error.response);
      }
    };

    fetchProfile();
  }, []);

  /* -------------------- HANDLE INPUT CHANGE -------------------- */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /* -------------------- SAVE PROFILE -------------------- */
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.put(
        "/users/update-profile",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("Profile successfully updated ✅");

      setTimeout(() => {
        setMessage("");
      }, 3000);

    } catch (error) {
      console.log("Update error:", error.response);
      setMessage("Update failed ❌");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">

        <div className="profile-avatar">
          {form.name ? form.name[0].toUpperCase() : "U"}
        </div>

        <h2>Profile Settings</h2>

        {message && <p className="success-msg">{message}</p>}

        <div className="profile-form">

  {/* NAME */}
  <label className="profile-label">Name</label>
  <input
    type="text"
    name="name"
    value={form.name}
    onChange={handleChange}
    placeholder="Enter your name"
  />

  {/* SKILLS OFFERED */}
  <label className="profile-label">Skills Offered</label>
  <input
    type="text"
    name="skillsOffered"
    value={form.skillsOffered}
    onChange={handleChange}
    placeholder="Example: Python, C, Java"
  />

  {/* SKILLS WANTED */}
  <label className="profile-label">Skills Wanted</label>
  <input
    type="text"
    name="skillsWanted"
    value={form.skillsWanted}
    onChange={handleChange}
    placeholder="Example: React, Node"
  />

  {/* HOBBIES */}
  <label className="profile-label">Hobbies</label>
  <input
    type="text"
    name="hobbies"
    value={form.hobbies}
    onChange={handleChange}
    placeholder="Example: Coding, Gaming"
  />

  {/* BIO */}
<label className="profile-label">Bio (Optional)</label>
<textarea
  name="bio"
  value={form.bio}
  onChange={handleChange}
  placeholder={`Write about yourself (optional)...

You can also add details (one per line):

Email - abc@gmail.com
GitHub - github.com/username
LinkedIn - linkedin.com/in/username

Tip: Use "Label - Value" format (Label - Value)`}
/>
</div>

        {/* 🔥 IMPORTANT FIX HERE */}
        <button type="button" onClick={handleSave}>
          Save Changes
        </button>

        <div className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </div>

      </div>
    </div>
  );
}

export default Profile;