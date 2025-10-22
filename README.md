# Mutual Fund Tracker Web Application

## Overview
This is a full-stack web application that allows users to register, log in, search for mutual funds, view detailed information about them, save funds, and access their saved funds list. The application provides a seamless and responsive experience on both desktop and mobile devices.

---

## Features

### User Authentication
- User registration and login with **JWT-based authentication**.
- Secure password handling with hashing.

### Mutual Fund Search
- Centralized search bar to search mutual funds using the [MFAPI](https://www.mfapi.in) public API.
- Clear display of search results.
- Clickable results to view detailed mutual fund information.

### Fund Management
- Logged-in users can **save funds** for future reference.
- A dedicated page to view all saved mutual funds.
- Optional feature to remove saved funds.

### User Experience Enhancements (Bonus)
- Loading spinner while fetching data.
- Error handling for API requests (e.g., "No results found").
- Fully responsive design for desktop and mobile devices.

---

## Technology Stack

### Frontend
- **React** for building UI components.
- **Tailwind CSS / Bootstrap** for styling and responsive layouts.
- **JWT** for handling authentication.

### Backend
- **Node.js** with **Express** for REST API development.
- **MongoDB** for storing users and their saved fund data.
- JWT-based authentication to protect routes and resources.
- ### Live Link: https://mutual-fund-tracker-2-iqzm.onrender.com

---

## Installation & Setup

1. **Clone the repository**
```bash
git clone <https://github.com/Ankit24072002/mutual-fund-tracker.git>


****Backend Setup

cd backend
npm install
npm run dev


Configure .env with MongoDB URI and JWT secret.

****Frontend Setup

cd frontend
npm install
npm run dev


Configure .env with backend API URL if needed.

Open the application in your browser at http://localhost:5173. or Live Link : https://mutual-fund-tracker-2-iqzm.onrender.com

API Endpoints
Authentication

POST /api/auth/register - Register a new user.

POST /api/auth/login - Log in an existing user.

Mutual Fund Management

GET /api/funds/:searchQuery - Fetch mutual funds by search term.

POST /api/funds/save - Save a fund for the logged-in user.

GET /api/funds/saved - Retrieve all saved funds for the logged-in user.

DELETE /api/funds/:fundId (optional) - Remove a saved fund.

Project Structure
frontend/       # React application
backend/        # Node.js + Express API
.env            # Environment variables
README.md       # Project documentation

Contributing

Contributions are welcome. Please fork the repository and submit pull requests for any bug fixes or feature improvements.

License

This project is licensed under the MIT License.

References

MFAPI - Mutual Fund API

React Documentation

Node.js Documentation

Express.js Documentation

MongoDB Documentation
