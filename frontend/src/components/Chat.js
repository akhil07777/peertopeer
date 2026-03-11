import React,{useEffect,useRef} from "react";
import Talk from "talkjs";

function Chat({currentUser,otherUser}){

const chatbox = useRef();

useEffect(()=>{

Talk.ready.then(()=>{

const me = new Talk.User({
id: currentUser._id,
name: currentUser.name,
email: currentUser.email
});

const other = new Talk.User({
id: otherUser._id,
name: otherUser.name,
email: otherUser.email
});

const session = new Talk.Session({
appId: "tbJhxgLH",
me: me
});

const conversationId = Talk.oneOnOneId(me,other);

const conversation = session.getOrCreateConversation(conversationId);

conversation.setParticipant(me);
conversation.setParticipant(other);

const inbox = session.createChatbox();

inbox.select(conversation);
inbox.mount(chatbox.current);

});

},[currentUser,otherUser]);

return <div style={{height:"500px"}} ref={chatbox}></div>;

}

export default Chat;