# Skill Swap – Peer-to-Peer Skill Exchange Platform

## Project Overview

Skill Swap is a web-based platform designed to enable users to exchange skills with one another without any monetary transactions. Instead of paying for courses, users can both teach and learn by connecting with others who have complementary skills.

The platform creates a collaborative learning environment, encouraging knowledge sharing, community interaction, and personal skill development.

---

## Features

* User authentication with secure registration and login
* Profile management for updating personal details and skills
* Dashboard to explore users and available skills
* Skill request system to send, accept, and reject requests
* Connections established after request acceptance
* Real-time chat using TalkJS
* Request history tracking (pending, accepted, rejected)
* Feedback system for user reviews
* Admin dashboard for monitoring platform activity

---

## Tech Stack

### Frontend

* React.js
* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Other Tools and Technologies

* JWT Authentication
* REST APIs
* TalkJS (chat integration)
* Git and GitHub

---

## Project Structure

### Frontend

```id="p3m9av"
frontend/
│
├── public/              # Static files (index.html, icons, manifest)
├── build/               # Production-ready optimized files
├── src/
│   ├── components/      # Reusable components (Chat)
│   ├── pages/           # Application pages (Dashboard, Profile, etc.)
│   ├── styles/          # CSS files
│   ├── App.js           # Routing configuration
│   └── index.js         # Entry point
```

### Backend

```id="f0t3e6"
server/
│
├── controllers/         # Business logic
├── middleware/          # Authentication and authorization
├── models/              # Database schemas
├── routes/              # API endpoints
├── server.js            # Backend entry point
└── .env                 # Environment variables
```

---

## How It Works

1. Users register and log into the platform
2. Users explore available skills and other users
3. A user sends a skill exchange request
4. The recipient accepts or rejects the request
5. If accepted, both users become connected
6. Users communicate through chat using TalkJS
7. Skill exchange takes place
8. Users provide feedback after completion

---

## Environment Variables

Create a .env file inside the server folder and add:

```id="olbkrb"
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## Installation and Setup

### 1. Clone the repository

```id="u11bgm"
git clone https://github.com/your-username/skill-swap.git
cd skill-swap
```

### 2. Install dependencies

Backend

```id="8ruxy2"
cd server
npm install
```

Frontend

```id="dr8c2k"
cd frontend
npm install
```

### 3. Run the application

Start backend server

```id="nf0bwo"
cd server
npm start
```

Start frontend

```id="0mm6cz"
cd frontend
npm start
```

---

## Deployment

The application can be deployed using:

* Backend: Render
* Frontend: Netlify or Vercel

Ensure environment variables are properly configured during deployment.

---

## Future Improvements

* Real-time notification system
* Skill scheduling and session management
* Video call integration
* Advanced admin analytics dashboard
* Improved mobile responsiveness

---

## Team Contribution

This project was developed collaboratively by a team of 5 members, with all members actively contributing to different aspects of the system.

* Contributed to frontend and backend development
* Participated in UI design and user experience improvements
* Worked on API development and database integration
* Assisted in implementing features such as skill requests, connections, and chat
* Involved in testing, debugging, and performance improvements
* Supported deployment and final project presentation

All team members worked together across multiple modules to ensure the successful completion of the project.

---

## License

This project is developed for educational purposes only.

---

## Acknowledgment

We thank our mentors and institution for their guidance and support throughout the development of this project.
