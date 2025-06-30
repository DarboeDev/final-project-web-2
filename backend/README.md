# SumaTask - Backend

## Project Description

SumaTask is a comprehensive Task Management System built using the MEAN stack (MongoDB, Express.js, Angular, Node.js). The system allows organizations to manage projects, tasks, and team collaboration efficiently with role-based access control and real-time task completion capabilities.

## Features List

### User Authentication & Authorization

- User registration and login with JWT tokens
- Role-based access control (Admin, Project Manager, Team Member)
- Secure password hashing with bcrypt
- Profile management and password change functionality

### Project Management

- Create, read, update, and delete projects
- Project status tracking (Planning, Active, On Hold, Completed, Cancelled)
- Priority levels (Low, Medium, High, Urgent)
- Team member assignment and management
- Project progress tracking
- Budget management

### Task Management

- Full CRUD operations for tasks
- Task assignment to team members
- Status tracking (Todo, In Progress, Review, Completed, Cancelled)
- Priority and due date management
- Task comments and collaboration
- File attachments support
- Progress tracking with estimated vs actual hours

### Category Management

- Create and manage task categories
- Color-coded categories for better organization
- Icon support for visual identification
- Category-based task filtering

### User Management

- Admin panel for user management
- User role assignment
- User activation/deactivation
- Team member directory

### Dashboard & Analytics

- Personal dashboard with task statistics
- Project progress overview
- Overdue task notifications
- Upcoming task reminders

## Technical Features

### Database Design

- MongoDB with Mongoose ODM
- Well-structured schemas with validation
- Relationships between Users, Projects, Tasks, and Categories
- Indexing for performance optimization

### API Design

- RESTful API architecture
- Comprehensive error handling
- Input validation and sanitization
- File upload support with multer
- Pagination support for large datasets

### Security

- JWT-based authentication
- Role-based authorization middleware
- Input validation and sanitization
- File upload security with type checking
- Password hashing with bcrypt

### Performance

- Database indexing for optimized queries
- Pagination for large datasets
- Efficient query aggregation
- File size limitations for uploads

## API Endpoints

### Authentication

- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- GET /api/auth/profile - Get user profile
- PUT /api/auth/profile - Update user profile
- PUT /api/auth/change-password - Change password

### Users

- GET /api/users - Get all users (Admin only)
- GET /api/users/:id - Get user by ID
- PUT /api/users/:id - Update user (Admin only)
- DELETE /api/users/:id - Delete user (Admin only)
- GET /api/users/team-members - Get team members list
- GET /api/users/dashboard-stats - Get dashboard statistics

### Projects

- GET /api/projects - Get all projects
- POST /api/projects - Create new project (Manager/Admin)
- GET /api/projects/:id - Get project by ID
- PUT /api/projects/:id - Update project
- DELETE /api/projects/:id - Delete project
- GET /api/projects/:id/tasks - Get project tasks

### Tasks

- GET /api/tasks - Get all tasks
- POST /api/tasks - Create new task
- GET /api/tasks/my-tasks - Get current user's tasks
- GET /api/tasks/:id - Get task by ID
- PUT /api/tasks/:id - Update task
- DELETE /api/tasks/:id - Delete task
- POST /api/tasks/:id/comments - Add comment to task
- POST /api/tasks/:id/attachments - Upload attachment to task

### Categories

- GET /api/categories - Get all categories
- POST /api/categories - Create new category (Manager/Admin)
- GET /api/categories/active - Get active categories
- GET /api/categories/:id - Get category by ID
- PUT /api/categories/:id - Update category
- DELETE /api/categories/:id - Delete category
- GET /api/categories/:id/tasks - Get category tasks

## Installation and Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env` file
4. Start the server: `npm start` or `npm run dev` for development

## Environment Variables

- MONGO_URI: MongoDB connection string
- JWT_SECRET: Secret key for JWT tokens
- PORT: Server port (default: 5000)
- MAX_FILE_SIZE: Maximum file upload size
- UPLOAD_PATH: Path for file uploads

## Dependencies

- express: Web framework for Node.js
- mongoose: MongoDB object modeling
- bcryptjs: Password hashing
- jsonwebtoken: JWT token generation and verification
- cors: Cross-origin resource sharing
- dotenv: Environment variable management
- multer: File upload handling
- validator: Input validation

## Database Schema

### User Model

- fullName, email, password
- role (admin, project_manager, team_member)
- department, profilePicture
- isActive, lastLogin, timestamps

### Project Model

- name, description, status, priority
- startDate, endDate, projectManager
- teamMembers array, budget, progress
- tags, isArchived, createdBy, timestamps

### Task Model

- title, description, status, priority
- dueDate, assignedTo, createdBy, project
- category, tags, estimatedHours, actualHours
- progress, comments array, attachments array
- completedAt, isArchived, timestamps

### Category Model

- name, description, color, icon
- isActive, createdBy, timestamps

This backend provides a robust foundation for a task management system with comprehensive features for project and task management, user collaboration, and system administration.
