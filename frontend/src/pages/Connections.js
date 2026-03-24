import React,{useEffect,useState,useRef} from "react";
import {useNavigate} from "react-router-dom";
import Talk from "talkjs";
import api from "../api";
import "../styles/Dashboard.css";

function Connections(){

const navigate = useNavigate();

const [connections,setConnections] = useState([]);
const [selectedUser,setSelectedUser] = useState(null);
const [chatUser,setChatUser] = useState(null);
const [unread,setUnread] = useState({});
const [profileRating,setProfileRating] = useState(null);

const [showFeedback,setShowFeedback] = useState(false);
const [feedbackUser,setFeedbackUser] = useState(null);

const [rating,setRating] = useState({
communication:0,
skillQuality:0,
helpfulness:0,
overall:0
});

const [review,setReview] = useState("");

const chatboxRef = useRef();
const sessionRef = useRef();

const currentUser = JSON.parse(localStorage.getItem("user"));

/* LOAD CONNECTIONS */

useEffect(()=>{

const fetchConnections = async ()=>{

const token = localStorage.getItem("token");

const res = await api.get("/requests/connections",{
headers:{Authorization:`Bearer ${token}`}
});

setConnections(res.data);

};

fetchConnections();

},[]);


/* DISCONNECT */

const removeConnection = async(id)=>{

const token = localStorage.getItem("token");

await api.delete(`/requests/remove/${id}`,{
headers:{Authorization:`Bearer ${token}`}
});

setConnections(prev=>prev.filter(c=>c._id!==id));

};
/* INITIALIZE TALKJS */

useEffect(() => {

if (!currentUser) return;

Talk.ready.then(() => {


const me = new Talk.User({
  id: String(currentUser?._id || "guest"),
  name: currentUser?.name?.trim() || "User",
  email: currentUser?.email || "user@email.com"
});

const session = new Talk.Session({
  appId: "tbJhxgLH",
  me: me
});

sessionRef.current = session;

/* MESSAGE LISTENER */
session.onMessage((event) => {

  const senderId = String(event.sender.id);
  const myId = String(currentUser?._id);

  if (senderId !== myId) {

    const convoId = event.conversation.id;

    setUnread(prev => {
      const updated = {
        ...prev,
        [convoId]: (prev[convoId] || 0) + 1
      };

      console.log("New message received 🔥");

      return updated;
    });

  }

});


});

/* CLEANUP */

return () => {
if (sessionRef.current) {
sessionRef.current.destroy();
sessionRef.current = null;
}
};

}, []);

/* OPEN CHAT */

useEffect(() => {

if (!chatUser || !sessionRef.current) return;

const me = sessionRef.current.me;

const other = new Talk.User({
id: String(chatUser?._id || "unknown"),
name: chatUser?.name?.trim() || "User",
email: chatUser?.email || "[user@email.com](mailto:user@email.com)"
});

const conversationId = Talk.oneOnOneId(me, other);

const conversation = sessionRef.current.getOrCreateConversation(conversationId);

conversation.setParticipant(me);
conversation.setParticipant(other);

const chatbox = sessionRef.current.createChatbox();

chatbox.select(conversation);

/* CLEAR OLD CHAT */

if (chatboxRef.current) {
chatboxRef.current.innerHTML = "";
chatbox.mount(chatboxRef.current);
}

/* RESET UNREAD */

setUnread(prev => {
const updated = { ...prev };
delete updated[conversationId];
return updated;
});

}, [chatUser]);

/* STAR COMPONENT */

const StarRating = ({ value, onChange }) => {

return (


<div className="stars">

  {[1, 2, 3, 4, 5].map(star => (

    <span
      key={star}
      className={star <= value ? "star active" : "star"}
      onClick={() => onChange(star)}
    >
      ★
    </span>

  ))}

</div>

);

};


/* LOAD EXISTING FEEDBACK */

const openFeedback = async(user)=>{

try{

const token = localStorage.getItem("token");

const res = await api.get(
`/feedback/existing/${user._id}`,
{
headers:{Authorization:`Bearer ${token}`}
}
);

if(res.data){

setRating({
communication:res.data.communication,
skillQuality:res.data.skillQuality,
helpfulness:res.data.helpfulness,
overall:res.data.overall
});

setReview(res.data.review || "");

}else{

setRating({
communication:0,
skillQuality:0,
helpfulness:0,
overall:0
});

setReview("");

}

setFeedbackUser(user);
setShowFeedback(true);

}catch(error){

console.log("Feedback fetch error",error);

}

};


/* OPEN PROFILE WITH RATING */

const openProfile = async(user)=>{

setSelectedUser(user);

try{

const res = await api.get(`/feedback/details/${user._id}`);

setProfileRating(res.data);

}catch(err){

console.log("Rating fetch error");

}

};


return(

<div className="dashboard">

{/* NAVBAR */}

<div className="dash-navbar">

<h2 className="brand">
SkillSwap <span>– P2P SkillExchanger</span>
</h2>

<button
className="request-btn"
onClick={()=>navigate("/dashboard")}
>
← Back
</button>

</div>


<h1 style={{textAlign:"center"}}>Connections</h1>


<div className="chat-layout">

{/* USER LIST */}

<div className="chat-users">

{connections.length===0 && <p>No connections yet</p>}

{connections.map(c=>{

if(!c.fromUser || !c.toUser) return null;

const user =
c.fromUser._id === currentUser._id
? c.toUser
: c.fromUser;

const convoId = Talk.oneOnOneId(
{id:currentUser._id},
{id:user._id}
);

return(

<div
key={c._id}
className={`chat-user ${chatUser?._id===user._id?"active-user":""}`}
onClick={()=>setChatUser(user)}
>

<div className="search-avatar">
{user?.name ? user.name[0].toUpperCase() : "U"}
</div>

<div className="chat-user-info">

<strong>{user?.name || "Unknown User"}</strong>

<p className="connected-text">
🟢 Connected
</p>

<div className="user-actions">

<button
className="small-btn"
onClick={(e)=>{
e.stopPropagation();
removeConnection(c._id);
}}
>
Disconnect
</button>

<button
className="small-btn"
onClick={(e)=>{
e.stopPropagation();
openProfile(user);
}}
>
Profile
</button>

<button
className="small-btn"
onClick={(e)=>{
e.stopPropagation();
openFeedback(user);
}}
>
Feedback
</button>

</div>

</div>

{unread[convoId] && (

<div className="unread-badge">
{unread[convoId]}
</div>

)}

</div>

);

})}

</div>


{/* CHAT WINDOW */}

<div className="chat-window">

{chatUser ? (

<div
ref={chatboxRef}
style={{height:"90%",width:"100%"}}
></div>

) : (

<p style={{textAlign:"center",marginTop:"200px"}}>
Select a connection to start chatting
</p>

)}

</div>

</div>


{/* FEEDBACK POPUP */}

{showFeedback && (

<div className="modal-overlay">

<div
className="modal-card"
onClick={(e)=>e.stopPropagation()}
>

<h2>Leave Feedback</h2>

<p>Rate your experience with {feedbackUser?.name}</p>

<label>Communication</label>
<StarRating
value={rating.communication}
onChange={(v)=>setRating({...rating,communication:v})}
/>

<label>Skill Quality</label>
<StarRating
value={rating.skillQuality}
onChange={(v)=>setRating({...rating,skillQuality:v})}
/>

<label>Helpfulness</label>
<StarRating
value={rating.helpfulness}
onChange={(v)=>setRating({...rating,helpfulness:v})}
/>

<label>Overall Experience</label>
<StarRating
value={rating.overall}
onChange={(v)=>setRating({...rating,overall:v})}
/>

<textarea
className="review-box"
placeholder="Write your review..."
value={review}
onChange={(e)=>setReview(e.target.value)}
></textarea>

<div className="feedback-actions">

<button
className="request-btn"
onClick={()=>setShowFeedback(false)}
>
Cancel
</button>

<button
className="swap-btn"
onClick={async()=>{

try{

const token = localStorage.getItem("token");

await api.post(
"/feedback/add",
{
toUser: feedbackUser._id,
communication: rating.communication,
skillQuality: rating.skillQuality,
helpfulness: rating.helpfulness,
overall: rating.overall,
review: review
},
{
headers:{Authorization:`Bearer ${token}`}
}
);

alert("Feedback submitted successfully");

setShowFeedback(false);

}catch(error){

console.log(error);
alert("Error submitting feedback");

}

}}
>
Submit
</button>

</div>

</div>

</div>

)}

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
<strong>Skills Offered:</strong>{" "}
{selectedUser.skillsOffered?.split(",").join(", ")||"Not added"}
</p>

<p>
<strong>Skills Wanted:</strong>{" "}
{selectedUser.skillsWanted?.split(",").join(", ")||"Not added"}
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

export default Connections;