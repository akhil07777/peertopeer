import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Dashboard.css";

function Dashboard() {

const navigate = useNavigate();
const user = JSON.parse(localStorage.getItem("user") || "{}");

const [searchTerm, setSearchTerm] = useState("");
const [results, setResults] = useState([]);
const [selectedUser, setSelectedUser] = useState(null);
const [requestCount, setRequestCount] = useState(0);
const [searchPerformed, setSearchPerformed] = useState(false);
const [ratings,setRatings] = useState({});
const [profileRating,setProfileRating] = useState(null);

const [notifications,setNotifications] = useState([]);
const handleLogout = () => {

localStorage.removeItem("token");
localStorage.removeItem("user");

navigate("/login");

};


/* ---------------- GET REQUEST COUNT ---------------- */

useEffect(()=>{

const fetchRequestCount = async ()=>{

try{

const token = localStorage.getItem("token");

const res = await api.get("/requests/incoming-count",{
headers:{Authorization:`Bearer ${token}`}
});

setRequestCount(res.data.count);

}catch(error){

console.log("Request count error");

}

};

fetchRequestCount();

},[]);


/* ---------------- FETCH NOTIFICATIONS ---------------- */

useEffect(()=>{

const fetchNotifications = async ()=>{

try{

const token = localStorage.getItem("token");

const res = await api.get("/notifications",{
headers:{Authorization:`Bearer ${token}`}
});

setNotifications(res.data);

}catch(error){

console.log("Notification fetch error");

}

};

fetchNotifications();

},[]);


/* ---------------- FETCH PROFILE RATING ---------------- */

useEffect(()=>{

const fetchProfileRating = async ()=>{

if(!selectedUser) return;

try{

const res = await api.get(`/feedback/details/${selectedUser._id}`);

setProfileRating(res.data);

}catch(err){

console.log("Profile rating fetch error");

}

};

fetchProfileRating();

},[selectedUser]);

/* ---------------- SEND REQUEST ---------------- */

const sendRequest = async ()=>{

try{

const token = localStorage.getItem("token");

await api.post(
"/requests/send",
{
toUser:selectedUser._id,
skill:searchTerm
},
{
headers:{Authorization:`Bearer ${token}`}
}
);

alert("Request sent successfully");

setSelectedUser(null);

}catch(error){

console.log(error);
alert("Request failed");

}

};


/* ---------------- SEARCH ---------------- */

const handleSearch = async ()=>{

if(!searchTerm.trim()){
setResults([]);
setSearchPerformed(false);
return;
}

try{

const token = localStorage.getItem("token");

const res = await api.get(
`/users/search?skill=${searchTerm}`,
{
headers:{Authorization:`Bearer ${token}`}
}
);

setResults(res.data);
setSearchPerformed(true);

/* FETCH RATINGS */

const ratingMap = {};

for(const u of res.data){

try{

const ratingRes = await api.get(`/feedback/rating/${u._id}`);

ratingMap[u._id] = ratingRes.data;

}catch(err){

ratingMap[u._id] = {average:0,count:0};

}

}

setRatings(ratingMap);

}catch(error){

console.log("Search error:",error);

}

};


return(

<div className="dashboard">

{/* NAVBAR */}

<div className="dash-navbar">

<h2 className="brand">
SkillSwap <span>– P2P SkillExchanger</span>
</h2>

<div className="nav-actions">

<button
className="request-btn"
onClick={()=>navigate("/requests")}
>
Requests {requestCount>0 && `(${requestCount})`}
</button>

<button
className="request-btn"
onClick={()=>navigate("/connections")}
>
Connections
</button>


{/* LOGOUT BUTTON */}

<button
className="request-btn"
onClick={handleLogout}
>
Logout
</button>


<div
className="profile-icon"
onClick={()=>navigate("/profile")}
>
{user.name ? user.name[0].toUpperCase() : "U"}
</div>

</div>

</div>


{/* HERO */}

<div className="dash-hero">

<h1>Welcome back, {user.name || "User"} 👋</h1>

<p>
Find skills, connect with peers, and grow together.
</p>

<form
className="search-box"
onSubmit={(e)=>{
e.preventDefault();
handleSearch();
}}
>

<input
type="text"
placeholder="Search skills (e.g. React, Python...)"
value={searchTerm}
onChange={(e)=>setSearchTerm(e.target.value)}
/>

<button type="submit">
Search
</button>

</form>


{/* SEARCH RESULTS */}

{results.length>0 &&(

<div className="search-results">

{results.map((u)=>(

<div
key={u._id}
className="search-user"
onClick={()=>setSelectedUser(u)}
>

<div className="search-avatar">
{u.name ? u.name[0].toUpperCase() : "U"}
</div>

<div className="search-name">

{u.name}

{ratings[u._id] && ratings[u._id].count>0 &&(

<span className="user-rating">
⭐ {ratings[u._id].average} ({ratings[u._id].count})
</span>

)}

</div>

</div>

))}

</div>

)}


{searchPerformed && results.length===0 &&(

<p style={{marginTop:"20px",color:"#94a3b8"}}>
No users found
</p>

)}

</div>


{/* USER PROFILE POPUP */}

{selectedUser &&(

<div
className="modal-overlay"
onClick={()=>{
setSelectedUser(null);
setProfileRating(null);
}}
>
<div
className="modal-card"
onClick={(e)=>e.stopPropagation()}
>

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

<p className="bio-title">
<strong>Bio:</strong>
</p>
<p className="bio-text">

{selectedUser?.bio
? selectedUser.bio.split("\n").map((line,index)=>{

if(line.includes("-")){

const [label,...rest] = line.split("-");
const value = rest.join("-").trim();
const lower = value.toLowerCase();

if(lower.includes("@")){
return(
<div key={index}>
<strong>{label} - </strong>
<a href={`mailto:${value}`} className="bio-link">
{value}
</a>
</div>
);
}

if(lower.includes("github")){
return(
<div key={index}>
<strong>{label} - </strong>
<a href={`https://${value.replace("https://","").replace("http://","")}`}
target="_blank"
rel="noreferrer"
className="bio-link">
View
</a>
</div>
);
}

if(lower.includes("linkedin")){
return(
<div key={index}>
<strong>{label} - </strong>
<a href={`https://${value.replace("https://","").replace("http://","")}`}
target="_blank"
rel="noreferrer"
className="bio-link">
View Profile
</a>
</div>
);
}

if(lower.includes("http") || lower.includes("www")){
return(
<div key={index}>
<strong>{label} - </strong>
<a href={value} target="_blank" rel="noreferrer" className="bio-link">
Open Link
</a>
</div>
);
}

}

return <div key={index}>{line}</div>;

})
:"No bio available"}

</p>


{/* ⭐ RATING SECTION */}

{profileRating && profileRating.count > 0 && (

<div className="rating-breakdown">

<p>
⭐ {profileRating.average} ({profileRating.count} reviews)
</p>

<p>
Communication ⭐{profileRating.communication}
</p>

<p>
Skill Quality ⭐{profileRating.skillQuality}
</p>

<p>
Helpfulness ⭐{profileRating.helpfulness}
</p>

</div>

)}


<p>
<strong>Status:</strong> Not connected
</p>

<button
className="swap-btn"
onClick={sendRequest}
>
Request Skill Swap
</button>

<div
className="close-btn"
onClick={()=>{
setSelectedUser(null);
setProfileRating(null);
}}
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