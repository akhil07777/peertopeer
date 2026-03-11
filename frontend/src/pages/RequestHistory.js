import React,{useEffect,useState} from "react";
import api from "../api";

function RequestHistory(){

const [history,setHistory] = useState([]);

useEffect(()=>{

const fetchHistory = async()=>{

const token = localStorage.getItem("token");

const res = await api.get(
"/requests/history",
{headers:{Authorization:`Bearer ${token}`}}
);

setHistory(res.data);

};

fetchHistory();

},[]);

return(

<div className="dashboard">

<h1>Request History</h1>

{history.map(r=>(
<div key={r._id} className="request-item">

<p>{r.fromUser.name} → {r.toUser.name}</p>

<span>{r.status}</span>

</div>
))}

</div>

);

}

export default RequestHistory;