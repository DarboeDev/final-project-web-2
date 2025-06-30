# SumaTask - Modern Task Management System

## 🧠 Overview

**SumaTask** is a comprehensive, modern task management system built with the **MEAN stack** (MongoDB, Express.js, Angular, Node.js). It provides organizations with powerful tools to manage projects, tasks, and team collaboration efficiently — with role-based access control and intuitive interfaces.

---

## 🚀 Key Features

### 🔐 Authentication & Security
- JWT-based Authentication
- Role-based Access Control (Admin, Project Manager, Team Member)
- Secure Password Handling with Bcrypt
- Protected API and frontend routes

### 📋 Smart Task Management
- One-click Task Completion
- Permission-aware Task Actions
- Task Status: Pending, In Progress, Completed, Cancelled
- Priority Levels: Low, Medium, High, Urgent
- Due Date & Assignment System

### 🎯 Project Management
- Full Project Lifecycle Tracking
- Project Dashboards with Budget & Timeline
- Milestone & Progress Tracking
- Team Assignment and Role Control

### 👥 Team Collaboration
- Team Directory with Profile Cards
- User Profiles and Role Editing
- Project Overview per Team Member
- Availability Status Tracking

### 🎨 Modern UI/UX
- Responsive Design (Mobile-First)
- Tailwind CSS Styling
- Sidebar Navigation with Active Indicators
- Smooth Loading & Error Handling
- Accessible with ARIA + Keyboard Support

### 🏷️ Category Management
- Custom Categories with Color Coding
- Category-based Task Filtering

### 📊 Analytics & Reporting
- Dashboard with Key Metrics
- Progress & Productivity Charts
- Visual Project/Task Summaries

---

## 🛠 Technology Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** for Auth
- **Bcrypt** for Password Hashing
- **Multer** for File Uploads

### Frontend
- **Angular 18**
- **Tailwind CSS**
- **RxJS**, **Angular Router**, **HTTP Client**

---

## 📝 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB v4.4+
- Angular CLI v18+

### 🔧 Backend Setup
```bash
cd backend
npm install
Create .env file:

env
Copy
Edit
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sumatask
JWT_SECRET=your-secret
JWT_EXPIRE=7d
NODE_ENV=development
Run server:

bash
Copy
Edit
npm start
💻 Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm start
App will run at:

Frontend: http://localhost:4200

Backend API: http://localhost:5000

📡 API Endpoints
🔑 Auth
POST /api/auth/register – Register

POST /api/auth/login – Login

GET /api/auth/me – Current User

PUT /api/auth/profile – Update Profile

PUT /api/auth/change-password – Change Password

📁 Projects
GET /api/projects

POST /api/projects

GET /api/projects/:id

PUT /api/projects/:id

DELETE /api/projects/:id

GET /api/projects/:id/tasks

✅ Tasks
GET /api/tasks

POST /api/tasks

GET /api/tasks/:id

PUT /api/tasks/:id

DELETE /api/tasks/:id

GET /api/tasks/my-tasks

POST /api/tasks/:id/comments

POST /api/tasks/:id/attachments

👤 Users
GET /api/users

GET /api/users/:id

PUT /api/users/:id

DELETE /api/users/:id

GET /api/users/team-members

🏷️ Categories
GET /api/categories

POST /api/categories

PUT /api/categories/:id

DELETE /api/categories/:id

👥 User Roles & Permissions
🔒 Admin
Full System Access

Manage Users, Projects, Tasks, Categories

Configure System Settings

🧑‍💼 Project Manager
Manage Assigned Projects

Assign Tasks

Complete Project Tasks

View Analytics

👷 Team Member
View & Complete Assigned Tasks

Update Progress

Edit Personal Profile

📚 Feature Deep Dive
✅ Task Completion Logic
One-click completion

Permissions:

✔ Assigned user

✔ Project Manager

✔ Admin

Real-time updates and status indicators

🧑‍🤝‍🧑 Team Management
Team Directory

Profile Cards & Editing

Project Assignment View

Active/Inactive Status

📱 UI Overview
🎨 Design
Mobile-first responsive layouts

Flexbox & Grid based layouts

Tailwind-powered theme

🧩 User Experience
Toast Notifications

Smooth Loading States

Real-time Validation

Error Handling

🔧 Dev Scripts
Frontend
bash
Copy
Edit
npm start         # Dev Server
npm run build     # Production Build
npm run lint      # Linter
npm run test      # Unit Tests
Backend
bash
Copy
Edit
npm start         # Production
npm run dev       # Dev (nodemon)
npm test          # Backend Tests
🚀 Deployment
Environment Variables
env
Copy
Edit
# Backend
PORT=5000
MONGODB_URI=your-mongo-uri
JWT_SECRET=your-secret
JWT_EXPIRE=7d
NODE_ENV=production

# Frontend
API_URL=https://your-api.com/api
Build frontend: npm run build

Deploy backend + frontend to hosting/server

Configure MongoDB Atlas or VPS instance
