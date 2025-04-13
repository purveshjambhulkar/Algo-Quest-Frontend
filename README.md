
# Coding Practice Application

This is a full-stack application for coding practice problems, with a separate backend and frontend.

## Project Structure

- `/backend` - Express server and MongoDB database
- `/src` - React frontend application

## Getting Started

### Running the Backend

```bash
cd backend
npm install
npm run dev
```

The backend server will start on port 5000.

### Running the Frontend

```bash
npm install
npm run dev
```

The frontend development server will start on port 8080.

## Features

- Browse coding problems by difficulty and category
- Track progress and maintain a streak
- Add new problems
- View detailed solutions

## Environment Variables

### Backend (backend/.env)
- PORT - The port number for the backend server (default: 5000)
- MONGODB_URI - MongoDB connection string

### Frontend (src/.env.development)
- VITE_API_URL - URL for the backend API (default: http://localhost:5000/api)
