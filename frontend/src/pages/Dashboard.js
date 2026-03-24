import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const wrapperRef = useRef(null);     // wraps input+button+dropdown together
  const inputRef   = useRef(null);     // used to measure input width for dropdown

  const [searchTerm,     setSearchTerm]     = useState("");
  const [selectedSkill,  setSelectedSkill]  = useState("");
  const [results,        setResults]        = useState([]);
  const [selectedUser,   setSelectedUser]   = useState(null);
  const [requestCount,   setRequestCount]   = useState(0);
  const [searchPerformed,setSearchPerformed]= useState(false);
  const [ratings,        setRatings]        = useState({});
  const [profileRating,  setProfileRating]  = useState(null);
  const [notifications,  setNotifications]  = useState([]);
  const [suggestions,    setSuggestions]    = useState([]);
  const [isLoading,      setIsLoading]      = useState(false);
  const [isSending,      setIsSending]      = useState(false);
  const [inputWidth,     setInputWidth]     = useState(0);
  const [inputLeft,      setInputLeft]      = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
const unreadCount = notifications.filter(n => !n.isRead).length;

  const skillOptions = [
    "C", "C++", "CSS", "Cyber Security",
    "Docker",
    "Git",
    "HTML",
    "Java", "JavaScript",
    "Kubernetes",
    "Linux",
    "Machine Learning", "MongoDB",
    "Node.js",
    "Python",
    "React",
    "SQL",
  ];

 const handleLogout = () => {
  const confirmLogout = window.confirm("Are you sure you want to logout?");
  
  if (confirmLogout) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }
};

  const formatSkills = (skills) => {
    if (!skills) return "N/A";
    if (Array.isArray(skills)) return skills.join(", ") || "N/A";
    return skills.split(",").map((s) => s.trim()).join(", ") || "N/A";
  };

  /* ---- measure input position & width so dropdown aligns exactly ---- */
  useEffect(() => {
    const measure = () => {
      if (inputRef.current && wrapperRef.current) {
        const inputRect   = inputRef.current.getBoundingClientRect();
        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        setInputWidth(inputRef.current.offsetWidth);
        setInputLeft(inputRect.left - wrapperRect.left);  // offset from wrapper
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /* ---- AUTOCOMPLETE: only skills that START WITH typed letters ---- */
  const handleInputChange = (value) => {
    setSearchTerm(value);
    setSelectedSkill("");

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const lower = value.toLowerCase();
    const matched = skillOptions.filter((s) =>
      s.toLowerCase().startsWith(lower)
    );
    setSuggestions(matched);
  };

  /* ---- close dropdown on outside click ---- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---- GET REQUEST COUNT ---- */
  useEffect(() => {
    const fetchRequestCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/requests/incoming-count", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequestCount(res.data.count);
      } catch (error) {
        console.error("Request count error:", error);
      }
    };
    fetchRequestCount();
  }, []);

  /* ---- FETCH NOTIFICATIONS ---- */
useEffect(() => {

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get("/notifications", {
      headers: { Authorization: `Bearer ${token}` }
    });

    setNotifications(res.data);
  };

  fetchNotifications();

  const interval = setInterval(fetchNotifications, 5000);

  return () => clearInterval(interval);

}, []);


 // Polling: fetch notifications every 5 seconds for near real-time updates

useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(res.data);

    } catch (err) {
      console.log("Auto notification fetch error");
    }
  }, 5000); // every 5 sec

  return () => clearInterval(interval);
}, []);
  /* ---- FETCH PROFILE RATING ---- */
  useEffect(() => {
    const fetchProfileRating = async () => {
      if (!selectedUser) return;
      try {
        const res = await api.get(`/feedback/details/${selectedUser._id}`);
        setProfileRating(res.data);
      } catch (err) {
        console.error("Profile rating fetch error:", err);
        setProfileRating(null);
      }
    };
    fetchProfileRating();
  }, [selectedUser]);

  /* ---- SEND REQUEST ---- */
  const sendRequest = async () => {
    const skillToSend = selectedSkill || searchTerm;
    if (!skillToSend.trim()) {
      alert("Please select or type a valid skill before sending a request.");
      return;
    }
    setIsSending(true);
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/requests/send",
        { toUser: selectedUser._id, skill: skillToSend },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Request sent successfully");
      setSelectedUser(null);
      setProfileRating(null);
    } catch (error) {
      console.error("Send request error:", error);
      alert("Request failed. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  /* ---- SEARCH ---- */
  const handleSearch = async () => {
    setSuggestions([]);
    if (!searchTerm.trim()) {
      setResults([]);
      setSearchPerformed(false);
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/users/search?skill=${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data);
      setSearchPerformed(true);
      const ratingMap = {};
      await Promise.all(
        res.data.map(async (u) => {
          try {
            const ratingRes = await api.get(`/feedback/rating/${u._id}`);
            ratingMap[u._id] = ratingRes.data;
          } catch {
            ratingMap[u._id] = { average: 0, count: 0 };
          }
        })
      );
      setRatings(ratingMap);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard">

      {/* ── NAVBAR ── */}
      <div className="dash-navbar">
        <h2 className="brand">
          SkillSwap <span>– P2P SkillExchanger</span>
        </h2>
        <div className="nav-actions">
          <button className="request-btn" onClick={() => navigate("/requests")}>
            Requests {requestCount > 0 && `(${requestCount})`}
          </button>
          <button
  className="request-btn"
 onClick={async () => {
  setShowNotifications(!showNotifications);

  const token = localStorage.getItem("token");

  try {
    await Promise.all(
      notifications.map(n =>
        api.put(`/notifications/read/${n._id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
      )
    );

    // update UI instantly
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );

  } catch (err) {
    console.log("Notification update error");
  }
}}
>
  🔔 {unreadCount > 0 && `(${unreadCount})`}
</button>
          <button className="request-btn" onClick={() => navigate("/connections")}>
            Connections
          </button>
          <button className="request-btn" onClick={handleLogout}>
            Logout
          </button>
          <div className="profile-icon" onClick={() => navigate("/profile")}>
            {user.name ? user.name[0].toUpperCase() : "U"}
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="dash-hero">
       <h1>
Welcome back, {user.name?.trim() || "User"} 👋
</h1>
        <p>Find skills, connect with peers, and grow together.</p>

        {/*
          ┌─────────────────────────────────────────┐
          │  wrapperRef  (position: relative)        │
          │  ┌──────────────────────┐ ┌──────────┐  │
          │  │ input (ref=inputRef) │ │  Search  │  │
          │  └──────────────────────┘ └──────────┘  │
          │  ┌──────────────────────┐               │
          │  │  dropdown            │ ← same width   │
          │  │  as input only       │               │
          │  └──────────────────────┘               │
          └─────────────────────────────────────────┘
        */}
        <div
          ref={wrapperRef}
          style={{ position: "relative", width: "100%" }}
        >
          <form
            className="search-box"
            onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Search or type any skill..."
              value={searchTerm}
              onChange={(e) => handleInputChange(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </button>
          </form>

          {/* ── SKILL SUGGESTIONS DROPDOWN ── */}
          {suggestions.length > 0 && (
           <ul
  style={{
    listStyle: "none",
    margin: 0,
    padding: 0,
    position: "absolute",
    top: "100%",
    left: inputLeft,
    width: inputWidth,
    zIndex: 1000,

    background: "#1e293b",
    border: "1px solid #475569",
    borderRadius: "12px",   // fully rounded
    marginTop: "6px",       // small gap from search bar

    maxHeight: "220px",
    overflowY: "auto",

    boxShadow: "0 10px 25px rgba(0,0,0,0.35)"
  }}
>
              {suggestions.map((skill, index) => (
                <li
                  key={index}
                  style={{
                    padding:      "10px 16px",
                    cursor:       "pointer",
                    color:        "#e2e8f0",
                    fontSize:     "15px",
                    borderBottom: index < suggestions.length - 1
                                    ? "1px solid #334155"
                                    : "none",
                    transition:   "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#334155")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                  onMouseDown={(e) => {
                    /* onMouseDown fires before onBlur so selection registers */
                    e.preventDefault();
                    setSearchTerm(skill);
                    setSelectedSkill(skill);
                    setSuggestions([]);
                  }}
                >
                  {skill}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── SEARCH RESULTS ── */}
        {results.length > 0 && (
          <div className="search-results">
            {results.map((u) => (
              <div
                key={u._id}
                className="search-user"
                onClick={() => setSelectedUser(u)}
              >
                <div className="search-avatar">
                  {u.name ? u.name[0].toUpperCase() : "U"}
                </div>
                <div className="search-name">
                  {u.name}
                  {ratings[u._id] && ratings[u._id].count > 0 && (
                    <span className="user-rating">
                      ⭐ {ratings[u._id].average} ({ratings[u._id].count})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {searchPerformed && results.length === 0 && !isLoading && (
          <p style={{ marginTop: "20px", color: "#94a3b8" }}>No users found</p>
        )}
      </div>

      {showNotifications && (
  <div style={{
    position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  top: "70px",
  background: "#1e293b",
  padding: "10px",
  borderRadius: "10px",
  width: "280px",
  maxHeight: "300px",
  overflowY: "auto",
  zIndex: 1000
  }}>
    <h4>Notifications</h4>

    {notifications.length === 0 ? (
      <p>No notifications</p>
    ) : (
      notifications.map(n => (
  <div
    key={n._id}
    style={{
      padding: "10px",
      borderBottom: "1px solid #334155",
      fontWeight: n.isRead ? "normal" : "bold",
      color: n.isRead ? "#94a3b8" : "#fff"
    }}
  >
    {n.message}
  </div>
))
    )}
  </div>
)}

      {/* ── USER PROFILE POPUP ── */}
      {selectedUser && (
        <div
          className="modal-overlay"
          onClick={() => { setSelectedUser(null); setProfileRating(null); }}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>

            <div className="modal-avatar">
              {selectedUser.name ? selectedUser.name[0].toUpperCase() : "U"}
            </div>

            <h2>{selectedUser.name}</h2>

            <p>
              <strong>Offers:</strong>{" "}
              {selectedUser?.skillsOffered?.split(",").join(", ") || "N/A"}
            </p>

            <p>
              <strong>Wants:</strong>{" "}
              {selectedUser?.skillsWanted?.split(",").join(", ") || "N/A"}
            </p>

            <p className="bio-title"><strong>Bio:</strong></p>
            <p className="bio-text">
              {selectedUser?.bio
                ? selectedUser.bio.split("\n").map((line, index) => {
                    if (line.includes("-")) {
                      const [label, ...rest] = line.split("-");
                      const value = rest.join("-").trim();
                      const lower = value.toLowerCase();

                      if (lower.includes("@")) {
                        return (
                          <div key={index}>
                            <strong>{label} - </strong>
                            <a href={`mailto:${value}`} className="bio-link">{value}</a>
                          </div>
                        );
                      }
                      if (lower.includes("github")) {
                        return (
                          <div key={index}>
                            <strong>{label} - </strong>
                            <a href={`https://${value.replace("https://","").replace("http://","")}`}
                              target="_blank" rel="noreferrer" className="bio-link">View</a>
                          </div>
                        );
                      }
                      if (lower.includes("linkedin")) {
                        return (
                          <div key={index}>
                            <strong>{label} - </strong>
                            <a href={`https://${value.replace("https://","").replace("http://","")}`}
                              target="_blank" rel="noreferrer" className="bio-link">View Profile</a>
                          </div>
                        );
                      }
                      if (lower.includes("http") || lower.includes("www")) {
                        return (
                          <div key={index}>
                            <strong>{label} - </strong>
                            <a href={value} target="_blank" rel="noreferrer" className="bio-link">Open Link</a>
                          </div>
                        );
                      }
                    }
                    return <div key={index}>{line}</div>;
                  })
                : "No bio available"}
            </p>

            {profileRating && profileRating.count > 0 && (
              <div className="rating-breakdown">
                <p>⭐ {profileRating.average} ({profileRating.count} reviews)</p>
                <p>Communication ⭐{profileRating.communication}</p>
                <p>Skill Quality ⭐{profileRating.skillQuality}</p>
                <p>Helpfulness ⭐{profileRating.helpfulness}</p>
              </div>
            )}

            <p><strong>Status:</strong> Not connected</p>

            <button
              className="swap-btn"
              onClick={sendRequest}
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Request Skill Swap"}
            </button>

            <div
              className="close-btn"
              onClick={() => { setSelectedUser(null); setProfileRating(null); }}
            >
              Close
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;