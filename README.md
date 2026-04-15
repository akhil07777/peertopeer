Here is your clean professional README without emojis, suitable for GitHub submission:


---

Skill Swap – Peer-to-Peer Skill Exchange Platform

Project Overview

Skill Swap is a web-based platform that enables users to exchange skills without any monetary transactions. Instead of paying for courses, users can both teach and learn by connecting with others who have complementary skills.

The platform promotes collaborative learning, community interaction, and personal skill development.


---

Features

Secure user authentication using JWT

Profile management for updating personal details and skills

Dashboard to explore users and available skills

Skill request system (send, accept, reject)

Connection establishment after request acceptance

Real-time chat using TalkJS

Request history tracking (pending, accepted, rejected)

Feedback and rating system

Admin dashboard for monitoring activities

Admin verification required before user login



---

Tech Stack

Frontend

React.js

HTML

CSS

JavaScript


Backend

Node.js

Express.js


Database

MongoDB


Other Technologies

JWT Authentication

REST APIs

TalkJS (chat integration)

Git and GitHub



---

Project Structure

Frontend

frontend/
│
├── public/              # Static files
├── build/               # Production build
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Application pages
│   ├── styles/          # CSS files
│   ├── App.js           # Routing
│   └── index.js         # Entry point


---

Backend

server/
│
├── controllers/         # Business logic
├── middleware/          # Authentication middleware
├── models/              # Database schemas
├── routes/              # API endpoints
├── server.js            # Main server file
└── .env                 # Environment variables


---

Working Flow

1. User registers on the platform


2. Admin verifies the user account


3. User logs in after approval


4. User explores available skills and profiles


5. User sends a skill exchange request


6. Receiver accepts or rejects the request


7. If accepted, a connection is established


8. Users communicate through TalkJS chat


9. Skill exchange takes place


10. Users provide feedback after completion




---

Authentication Flow

User submits login credentials from frontend

Backend validates credentials

Backend checks admin approval status

If valid, JWT token is generated

Token is sent to frontend

Frontend includes token in API requests

Middleware verifies token for protected routes



---

Future Enhancements

Video call integration

AI-based skill recommendation system

Notification system

Mobile application support



---

Contributors

Add team member names here


---

License

This project is developed for educational purposes.


---

If you want, I can next:

Convert this into a short 1-page version for record submission

Add GitHub badges and screenshots section

Prepare a perfect viva explanation from this README
