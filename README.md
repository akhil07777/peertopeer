#SKILL SWAP – PEER-TO-PEER SKILL EXCHANGE PLATFORM

## PROJECT OVERVIEW
Skill Swap is a web-based platform where users can share and learn skills by connecting with each other. Users can showcase their skills, explore others, and interact through a structured system.

The platform supports collaborative learning and helps users improve their skills through peer interaction.


## FEATURES
- Secure user authentication using JWT  
- Profile management (skills, personal details)  
- Dashboard to explore users and skills  
- Skill request system (send, accept, reject)  
- Connection system after request approval  
- Real-time chat using TalkJS  
- Request history tracking  
- Feedback and rating system  
- Admin dashboard for monitoring  
- Admin verification before login  


## TECH STACK

### FRONTEND
- React.js  
- HTML  
- CSS  
- JavaScript  

### BACKEND
- Node.js  
- Express.js  

### DATABASE
- MongoDB  

### OTHER TECHNOLOGIES
- JWT Authentication  
- REST APIs  
- TalkJS  
- Git & GitHub  


## PROJECT STRUCTURE

### FRONTEND
frontend/
│
├── public/              # Static files  
├── build/               # Production build  
├── src/  
│   ├── components/      # Reusable components  
│   ├── pages/           # Pages (Dashboard, Profile, etc.)  
│   ├── styles/          # CSS files  
│   ├── App.js           # Routing  
│   └── index.js         # Entry point  


### BACKEND
server/
│
├── controllers/         # Business logic  
├── middleware/          # Authentication middleware  
├── models/              # Database schemas  
├── routes/              # API endpoints  
├── server.js            # Main server  
└── .env                 # Environment variables  


## WORKING FLOW
1. User registers on the platform  
2. Admin verifies the account  
3. User logs in after approval  
4. User explores skills and profiles  
5. User sends a skill exchange request  
6. Receiver accepts or rejects  
7. If accepted, connection is established  
8. Users communicate via TalkJS  
9. Skill exchange happens  
10. Feedback is provided  


## AUTHENTICATION FLOW
- User sends login request  
- Backend validates credentials  
- Backend checks admin approval  
- JWT token is generated  
- Token sent to frontend  
- Frontend attaches token in requests  
- Middleware verifies token  


## FUTURE ENHANCEMENTS
- Video call integration  
- AI-based skill recommendation  
- Notification system  
- Mobile app support  


## CONTRIBUTORS
- 
- 
-
- Akhil A Anand
- 

## LICENSE
This project is developed for educational purposes.
