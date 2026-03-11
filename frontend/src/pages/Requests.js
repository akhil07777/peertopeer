import React,{useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../api";
import "../styles/Dashboard.css";

function Requests(){

const navigate = useNavigate();

const [incoming,setIncoming] = useState([]);
const [outgoing,setOutgoing] = useState([]);
const [selectedUser,setSelectedUser] = useState(null);
const [ratings,setRatings] = useState({});
const [profileRating,setProfileRating] = useState(null);

/* STATUS FORMAT */

const getStatus = (status)=>{

if(status==="pending") return "🟡 Pending";
if(status==="accepted") return "🟢 Connected";
if(status==="rejected") return "🔴 Rejected";

return status;

};


useEffect(()=>{

const fetchRequests = async ()=>{

try{

const token = localStorage.getItem("token");

const res = await api.get("/requests/all",{
headers:{
Authorization:`Bearer ${token}`
}
});

const uniqueIncoming = Array.from(
new Map(
res.data.incoming.map(r=>[
`${r.fromUser._id}-${r.skill}`,r
])
).values()
);

const uniqueOutgoing = Array.from(
new Map(
res.data.outgoing.map(r=>[
`${r.toUser._id}-${r.skill}`,r
])
).values()
);

setIncoming(uniqueIncoming);
setOutgoing(uniqueOutgoing);

}catch(error){
console.log("Fetch request error");
}

};

fetchRequests();

},[]);


/* ACCEPT REQUEST */

const acceptRequest = async(id)=>{

const token = localStorage.getItem("token");

await api.put(`/requests/accept/${id}`,{},{
headers:{Authorization:`Bearer ${token}`}
});

setIncoming(prev=>prev.filter(r=>r._id!==id));

};


/* REJECT REQUEST */

const rejectRequest = async(id)=>{

const token = localStorage.getItem("token");

await api.put(`/requests/reject/${id}`,{},{
headers:{Authorization:`Bearer ${token}`}
});

setIncoming(prev=>prev.filter(r=>r._id!==id));

};


/* CANCEL PENDING REQUEST */

const cancelRequest = async(id)=>{

const token = localStorage.getItem("token");

await api.delete(`/requests/cancel/${id}`,{
headers:{Authorization:`Bearer ${token}`}
});

setOutgoing(prev=>prev.filter(r=>r._id!==id));

};






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





/* DELETE REJECTED REQUEST */

const deleteRequest = async(id)=>{

const token = localStorage.getItem("token");

await api.delete(`/requests/delete/${id}`,{
headers:{Authorization:`Bearer ${token}`}
});

setOutgoing(prev=>prev.filter(r=>r._id!==id));

};


return(

<div className="dashboard">

<div className="dash-navbar">

<h2 className="brand">
SkillSwap <span>– P2P SkillExchanger</span>
</h2>

<button
className="request-btn"
onClick={()=>navigate("/dashboard")}
>
Back
</button>

</div>


<div className="dash-hero">

<h1>Skill Requests</h1>

<div className="skills-grid">


{/* INCOMING REQUESTS */}

<div className="skill-card">

<h3>Incoming Requests</h3>

{incoming.length===0 && <p>No incoming requests</p>}

{incoming.map(req=>(

<div
key={req._id}
className="request-item"
onClick={()=>setSelectedUser({
_id:req.fromUser?._id,
name:req.fromUser?.name,
skillsOffered:req.fromUser?.skillsOffered,
skillsWanted:req.fromUser?.skillsWanted,
bio:req.fromUser?.bio,
status:req.status
})}
>

<div className="request-left">

<div className="search-avatar">
{req.fromUser?.name?.[0]?.toUpperCase()||"U"}
</div>

<strong>{req.fromUser?.name||"Unknown User"}</strong>

</div>

<div className="request-actions">

<button
className="accept-btn"
onClick={(e)=>{
e.stopPropagation();
acceptRequest(req._id);
}}
>
Accept
</button>

<button
className="reject-btn"
onClick={(e)=>{
e.stopPropagation();
rejectRequest(req._id);
}}
>
Reject
</button>

</div>

</div>

))}

</div>


{/* OUTGOING REQUESTS */}

<div className="skill-card">

<h3>Outgoing Requests</h3>

{outgoing.length===0 && <p>No outgoing requests</p>}

{outgoing.map(req=>(

<div
key={req._id}
className="request-item"
onClick={()=>setSelectedUser({
_id:req.toUser?._id,
name:req.toUser?.name,
skillsOffered:req.toUser?.skillsOffered,
skillsWanted:req.toUser?.skillsWanted,
bio:req.toUser?.bio,
status:req.status
})}
>

<div className="request-left">

<div className="search-avatar">
{req.toUser?.name?.[0]?.toUpperCase()||"U"}
</div>

<strong>{req.toUser?.name||"Unknown User"}</strong>

</div>

<div className="request-actions">

<span className="pending-status">
{getStatus(req.status)}
</span>

{req.status==="pending" && (
<button
className="reject-btn"
onClick={(e)=>{
e.stopPropagation();
cancelRequest(req._id);
}}
>
Cancel
</button>
)}

{req.status==="rejected" && (
<button
className="reject-btn"
onClick={(e)=>{
e.stopPropagation();
deleteRequest(req._id);
}}
>
Delete
</button>
)}

</div>

</div>

))}

</div>

</div>

</div>


{/* USER PROFILE POPUP */}

{selectedUser &&(

<div
className="modal-overlay"
onClick={()=>setSelectedUser(null)}
>

<div
className="modal-card"
onClick={(e)=>e.stopPropagation()}
>

<div className="modal-avatar">
{selectedUser?.name?.[0]?.toUpperCase()||"U"}
</div>

<h2>{selectedUser?.name||"Unknown User"}</h2>

<p>
<strong>Skills Offered:</strong>{" "}
{selectedUser?.skillsOffered?.split(",").join(", ")||"Not added"}
</p>

<p>
<strong>Skills Wanted:</strong>{" "}
{selectedUser?.skillsWanted?.split(",").join(", ")||"Not added"}
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

{profileRating && profileRating.count>0 &&(

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
<strong>Status:</strong>{" "}
{getStatus(selectedUser?.status)}
</p>

<div
className="close-btn"
onClick={()=>setSelectedUser(null)}
>
Close
</div>

</div>

</div>

)}

</div>

);

}

export default Requests;