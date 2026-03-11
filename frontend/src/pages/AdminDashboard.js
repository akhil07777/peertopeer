import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Dashboard.css";

function AdminDashboard(){

const navigate = useNavigate();

const [users,setUsers] = useState([]);
const [feedback,setFeedback] = useState([]);
const [selectedUser,setSelectedUser] = useState(null);
const [profileRating,setProfileRating] = useState(null);

const [stats,setStats] = useState({
users:0,
feedbacks:0,
requests:0
});



/* LOAD STATS */
/* LOAD USERS */

useEffect(()=>{

const fetchUsers = async ()=>{

try{

const token = localStorage.getItem("token");

const res = await api.get("/admin/users",{
headers:{Authorization:`Bearer ${token}`}
});

/* REMOVE ADMIN USER */

const filteredUsers = res.data.filter(
user => user.email !== "admin123@gmail.com"
);
setUsers(filteredUsers);

setStats(prev => ({
...prev,
users: filteredUsers.length
}));
}catch(error){

console.log("Users fetch error");

}

};

fetchUsers();

},[]);


/* LOAD REQUESTS */

useEffect(()=>{

const fetchRequests = async ()=>{

try{

const token = localStorage.getItem("token");

const res = await api.get("/requests/requests",{
headers:{Authorization:`Bearer ${token}`}
});

setStats(prev => ({
...prev,
requests: res.data.length
}));

}catch(error){
console.log("Requests fetch error");
}

};

fetchRequests();

},[]);


/* LOAD FEEDBACK */

useEffect(()=>{

const fetchFeedback = async ()=>{

try{

const token = localStorage.getItem("token");

const res = await api.get("/admin/feedbacks",{
headers:{Authorization:`Bearer ${token}`}
});

setFeedback(res.data);

setStats(prev => ({
...prev,
feedbacks: res.data.length
}));

}catch(error){
console.log("Feedback fetch error");
}

};

fetchFeedback();

},[]);

/* DELETE USER */

/* DELETE USER */

const deleteUser = async(id)=>{

if(!window.confirm("Delete this user?")) return;

try{

const token = localStorage.getItem("token");

await api.delete(`/admin/users/${id}`,{
headers:{Authorization:`Bearer ${token}`}
});

/* UPDATE USER LIST */

setUsers(prevUsers => prevUsers.filter(u => u._id !== id));

/* UPDATE USER COUNT */

setStats(prev => ({
...prev,
users: prev.users - 1
}));

}catch(error){

console.log("Delete error");

}

};
/* DELETE FEEDBACK */

const deleteFeedback = async(id)=>{

if(!window.confirm("Delete this feedback?")) return;

try{

const token = localStorage.getItem("token");

await api.delete(`/admin/feedback/${id}`,{
headers:{Authorization:`Bearer ${token}`}
});

setFeedback(feedback.filter(f=>f._id !== id));

}catch(error){
console.log("Delete feedback error");
}

};





/* OPEN PROFILE */

const openProfile = async(user)=>{

setSelectedUser(user);

try{

const res = await api.get(`/feedback/details/${user._id}`);

setProfileRating(res.data);

}catch(err){
console.log("Rating fetch error");
}

};

/* LOGOUT */

const logout = ()=>{
localStorage.removeItem("token");
localStorage.removeItem("user");
navigate("/login");
};

return(

<div className="dashboard">

{/* NAVBAR */}

<div className="dash-navbar">

<h2 className="brand">
SkillSwap <span>– Admin Panel</span>
</h2>

<div className="nav-actions">

<button
className="request-btn"
onClick={logout}

>

Logout </button>

</div>

</div>

{/* HERO */}

<div className="dash-hero">

<h1>Welcome Admin 👋</h1>

<p>
Manage users, feedback and monitor platform activity.
</p>

</div>

{/* STATS */}

<div style={{
display:"flex",
gap:"20px",
justifyContent:"center",
marginBottom:"40px"
}}>

<div className="stat-card">
<h3>Total Users</h3>
<p>{stats.users}</p>
</div>

<div className="stat-card">
<h3>Total Feedback</h3>
<p>{stats.feedbacks}</p>
</div>

<div className="stat-card">
<h3>Total Requests</h3>
<p>{stats.requests}</p>
</div>

</div>

{/* USERS TABLE */}

<h2 style={{textAlign:"center"}}>Users</h2>

<table className="admin-table">

<thead>
<tr>
<th>Name</th>
<th>Email</th>
<th>View Profile</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{users.map(u=>(

<tr key={u._id} className="admin-row">

<td>{u.name}</td>
<td>{u.email}</td>

<td>

<button
className="btn"
onClick={(e)=>{
e.stopPropagation();
openProfile(u);
}}

>

View </button>

</td>

<td>

<button
className="delete-btn"
onClick={(e)=>{
e.stopPropagation();
deleteUser(u._id);
}}

>

Delete </button>

</td>

</tr>

))}

</tbody>

</table>

{/* FEEDBACK TABLE */}

<h2 style={{textAlign:"center",marginTop:"50px"}}>Feedback</h2>

<table className="admin-table">

<thead>
<tr>
<th>From</th>
<th>To</th>
<th>Review</th>
<th>Rating</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{feedback.map(f=>(

<tr key={f._id} className="admin-row">

<td>{f.fromUser?.name}</td>
<td>{f.toUser?.name}</td>
<td>{f.review}</td>
<td>⭐ {f.overall}</td>

<td>

<button
className="delete-btn"
onClick={()=>deleteFeedback(f._id)}

>

Delete </button>

</td>

</tr>

))}

</tbody>

</table>

{/* PROFILE POPUP */}

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
{selectedUser.name[0].toUpperCase()}
</div>

<h2>{selectedUser.name}</h2>

<p>
<strong>Email:</strong> {selectedUser.email}
</p>

<p>
<strong>Skills Offered:</strong>{" "}
{selectedUser.skillsOffered || "Not added"}
</p>

<p>
<strong>Skills Wanted:</strong>{" "}
{selectedUser.skillsWanted || "Not added"}
</p>

<p>
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
{profileRating && profileRating.count>0 &&(

<div className="rating-breakdown">

<p>
⭐ {profileRating.average} ({profileRating.count} reviews)
</p>

<p>Communication ⭐{profileRating.communication}</p>
<p>Skill Quality ⭐{profileRating.skillQuality}</p>
<p>Helpfulness ⭐{profileRating.helpfulness}</p>

</div>

)}

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

export default AdminDashboard;
