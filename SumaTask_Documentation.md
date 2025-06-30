# SumaTask - Modern Task Management System

## Project Documentation

**Student Name:** Muhammed Darboe  
**Date:** June 30, 2025  
**Course:** Web Development 2  
**Project Type:** MEAN Stack Application

---

## Table of Contents

1. [Project Description](#project-description)
2. [Technical Overview](#technical-overview)
3. [Features List](#features-list)
4. [System Architecture](#system-architecture)
5. [User Roles and Permissions](#user-roles-and-permissions)
6. [Screenshots](#screenshots)
7. [Installation Guide](#installation-guide)
8. [API Documentation](#api-documentation)
9. [Conclusion](#conclusion)

---

## Project Description

### Overview

SumaTask is a comprehensive, modern task management system designed to streamline workflow processes and enhance team productivity. Built using the MEAN stack (MongoDB, Express.js, Angular, Node.js), the application provides organizations with powerful tools to manage projects, tasks, and team collaboration efficiently.

### Problem Statement

Many organizations struggle with task management, project coordination, and team collaboration. Traditional tools often lack proper role-based access control, intuitive interfaces, or comprehensive project oversight capabilities. SumaTask addresses these challenges by providing a unified platform that combines project management, task tracking, and team collaboration in one seamless application.

### Solution

SumaTask offers a complete task management solution with:

- **Role-based Access Control**: Three distinct user roles (Admin, Project Manager, Team Member) with specific permissions
- **Intuitive Task Management**: One-click task completion with smart permission checking
- **Comprehensive Project Oversight**: Full project lifecycle management from planning to completion
- **Modern User Interface**: Responsive design built with Tailwind CSS for optimal user experience
- **Real-time Collaboration**: Team directory, user profiles, and project assignment tracking

### Target Audience

- **Small to Medium Businesses**: Organizations looking for efficient project and task management
- **Development Teams**: Software development teams requiring agile project management
- **Educational Institutions**: Schools and universities managing academic projects
- **Freelancers and Consultants**: Individual professionals managing multiple client projects

---

## Technical Overview

### Technology Stack

#### Backend Technologies

- **Node.js (v16+)**: JavaScript runtime environment providing the server-side foundation
- **Express.js**: Fast, unopinionated web framework for building RESTful APIs
- **MongoDB**: NoSQL database for flexible, scalable data storage
- **Mongoose**: Object Document Mapping (ODM) library for MongoDB with schema validation
- **JSON Web Tokens (JWT)**: Secure authentication and authorization mechanism
- **bcrypt**: Industry-standard password hashing for security
- **Multer**: Middleware for handling file uploads

#### Frontend Technologies

- **Angular 18**: Modern, component-based frontend framework with TypeScript
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **RxJS**: Reactive programming library for handling asynchronous operations
- **Angular Router**: Client-side routing with route guards for protection
- **Angular HTTP Client**: HTTP communication with interceptors for token management

#### Development Tools

- **TypeScript**: Type-safe JavaScript for better code quality and maintainability
- **Angular CLI**: Command-line interface for Angular development
- **Nodemon**: Development utility for automatic server restarts
- **CORS**: Cross-Origin Resource Sharing configuration for API access

### Database Design

The application uses MongoDB with the following main collections:

1. **Users Collection**: Stores user information, roles, and authentication data
2. **Projects Collection**: Contains project details, team assignments, and progress tracking
3. **Tasks Collection**: Manages individual tasks with assignments, status, and metadata
4. **Categories Collection**: Provides task organization and categorization system

---

## Features List

### 🔐 Authentication & Security Features

#### User Authentication

- **Secure Registration**: User registration with email validation and role assignment
- **JWT-based Login**: Token-based authentication for secure API access
- **Password Security**: bcrypt hashing for password storage
- **Session Management**: Automatic token refresh and logout functionality

#### Authorization & Access Control

- **Role-based Permissions**: Three-tier permission system (Admin, Project Manager, Team Member)
- **Route Protection**: Frontend and backend route guards preventing unauthorized access
- **API Security**: Protected endpoints with JWT verification middleware
- **Data Validation**: Input sanitization and validation on both client and server sides

### 📋 Smart Task Management Features

#### Task Operations

- **One-Click Completion**: Simplified task completion with single button interaction
- **Smart Permissions**: Intelligent permission checking - only assigned users, project managers, or admins can complete tasks
- **Task CRUD Operations**: Complete Create, Read, Update, Delete functionality for tasks
- **Bulk Operations**: Multiple task selection and batch operations

#### Task Organization

- **Status Tracking**: Four status levels (Pending, In Progress, Completed, Cancelled)
- **Priority Management**: Four priority levels (Low, Medium, High, Urgent) with color coding
- **Due Date Management**: Deadline tracking with overdue indicators
- **Task Assignment**: Assign tasks to specific team members with notification system
- **Task Filtering**: Filter tasks by status, priority, assignee, or due date

#### Task Details

- **Rich Descriptions**: Detailed task descriptions with formatting support
- **Tag System**: Categorize tasks with custom tags for better organization
- **Comment System**: Task-specific commenting for collaboration and updates
- **File Attachments**: Upload and manage task-related documents and files

### 🎯 Project Management Features

#### Project Lifecycle

- **Complete Project Management**: Full project lifecycle from planning to completion
- **Status Tracking**: Five project statuses (Planning, Active, On Hold, Completed, Cancelled)
- **Progress Monitoring**: Visual progress indicators and completion percentages
- **Milestone Tracking**: Set and track important project milestones

#### Team Management

- **Project Manager Assignment**: Designated project managers with special permissions
- **Team Member Assignment**: Add and remove team members from projects
- **Role Management**: Define team member roles within projects
- **Workload Distribution**: Balance task assignments across team members

#### Project Features

- **Budget Management**: Track project budgets and expenses
- **Timeline Management**: Set project start and end dates with deadline tracking
- **Project Dashboard**: Comprehensive overview of project status and metrics
- **Resource Planning**: Allocate resources and track utilization

### 👥 Team Collaboration Features

#### Team Directory

- **Visual Team Cards**: Modern card-based layout showing team member information
- **Contact Information**: Easy access to team member contact details
- **Skill Tracking**: Track team member skills and expertise areas
- **Availability Status**: Real-time active/inactive status monitoring

#### User Profile Management

- **Comprehensive Profiles**: Detailed user profiles with photo support
- **Profile Editing**: Users can update their own profiles
- **Admin Management**: Administrators can edit any user profile
- **Department Organization**: Organize users by departments or teams

#### Communication Features

- **Project Assignment Overview**: See which projects each team member is working on
- **Easy Navigation**: Intuitive back buttons and breadcrumb navigation
- **Team Analytics**: Track team productivity and contribution metrics

### 🎨 User Interface Features

#### Design & Layout

- **Responsive Design**: Mobile-first approach working on all device sizes
- **Modern Styling**: Clean, professional interface using Tailwind CSS
- **Consistent Branding**: Unified color scheme and typography throughout
- **Intuitive Navigation**: Clear sidebar navigation with active state indicators

#### User Experience

- **Loading States**: Smooth loading indicators for all async operations
- **Error Handling**: User-friendly error messages and recovery options
- **Form Validation**: Real-time form validation with helpful error messages
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

#### Interactive Elements

- **Hover Effects**: Subtle animations and hover states for better interaction
- **Modal Dialogs**: Clean modal interfaces for important actions
- **Confirmation Dialogs**: Safety confirmations for destructive actions
- **Toast Notifications**: Non-intrusive success and error notifications

### 🏷️ Category Management Features

#### Organization System

- **Color-coded Categories**: Visual categorization with customizable colors
- **Custom Category Creation**: Create and manage custom task categories
- **Icon Support**: Visual icons for easy category identification
- **Category-based Filtering**: Filter tasks and projects by categories

### 📊 Analytics & Reporting Features

#### Dashboard Analytics

- **Project Statistics**: Overview of project completion rates and status distribution
- **Task Metrics**: Track task completion, pending items, and overdue tasks
- **Team Performance**: Monitor individual and team productivity metrics
- **Time Tracking**: Track time spent on tasks and projects

#### Visual Reporting

- **Progress Charts**: Visual representation of project and task progress
- **Status Distribution**: Pie charts showing status breakdowns
- **Timeline Views**: Gantt-style timeline visualization for project planning
- **Export Capabilities**: Export reports and data for external analysis

---

## System Architecture

### Application Architecture

SumaTask follows a three-tier architecture pattern:

1. **Presentation Tier (Angular Frontend)**

   - Component-based architecture with Angular
   - Reactive programming with RxJS
   - State management through services
   - Route guards for navigation protection

2. **Application Tier (Express.js Backend)**

   - RESTful API design with Express.js
   - Middleware for authentication and validation
   - Business logic separation in controllers
   - Error handling and logging

3. **Data Tier (MongoDB Database)**
   - Document-based data storage
   - Schema validation with Mongoose
   - Indexing for performance optimization
   - Data relationships and references

### Security Architecture

- **Authentication Flow**: JWT token generation and validation
- **Authorization Middleware**: Role-based access control implementation
- **Data Validation**: Input sanitization and schema validation
- **Password Security**: bcrypt hashing with salt rounds
- **CORS Configuration**: Cross-origin request handling

---

## User Roles and Permissions

### Admin Role

**Full System Access**

- ✅ Complete user management (create, edit, delete users)
- ✅ Project management across all projects
- ✅ Task completion for any task in the system
- ✅ System configuration and settings
- ✅ Access to all analytics and reports
- ✅ Category management and customization

### Project Manager Role

**Project-Focused Access**

- ✅ Manage assigned projects completely
- ✅ Create and assign tasks within their projects
- ✅ Complete tasks within their managed projects
- ✅ Manage team members for their projects
- ✅ View project-specific analytics
- ✅ Access to project budgets and timelines

### Team Member Role

**Task-Focused Access**

- ✅ View assigned tasks and associated projects
- ✅ Complete their own assigned tasks
- ✅ Update task progress and add comments
- ✅ View team directory and member profiles
- ✅ Manage personal profile and settings
- ✅ Access to personal productivity metrics

---

## Screenshots

_Note: The following section describes where screenshots should be placed in the Word document. Actual screenshots should be captured from the running application._

### Screenshot 1: Login Page

**Description**: The main login interface showing the SumaTask branding, email/password input fields, and options for user registration. Demonstrates the clean, modern design with Tailwind CSS styling.

**Key Elements to Highlight**:

- Clean, centered login form
- SumaTask branding and logo
- Responsive design elements
- Form validation indicators

### Screenshot 2: Dashboard Overview

**Description**: The main dashboard showing project statistics, recent tasks, and navigation sidebar. Demonstrates the comprehensive overview available to users upon login.

**Key Elements to Highlight**:

- Sidebar navigation with active states
- Project statistics cards
- Recent activity feed
- User profile indicator in header

### Screenshot 3: Project Management Page

**Description**: The project list view showing multiple projects with their status, progress, and team assignments. Demonstrates the project management capabilities.

**Key Elements to Highlight**:

- Project cards with status indicators
- Progress bars and completion percentages
- Team member avatars
- Action buttons for project management

### Screenshot 4: Task List View

**Description**: The task management interface showing tasks with one-click completion buttons, priority indicators, and assignment information.

**Key Elements to Highlight**:

- Task cards with status badges
- One-click completion buttons (only visible to authorized users)
- Priority color coding
- Assignment and due date information

### Screenshot 5: Task Detail Page

**Description**: Individual task view showing detailed information, comments, attachments, and available actions based on user permissions.

**Key Elements to Highlight**:

- Detailed task information
- Permission-based action buttons
- Comment section for collaboration
- File attachment area

### Screenshot 6: Team Management Page

**Description**: Team directory showing all team members with their profiles, status indicators, and project assignments.

**Key Elements to Highlight**:

- Team member cards with photos/avatars
- Active/inactive status indicators
- Project assignment overview
- View profile and edit buttons (admin only)

### Screenshot 7: User Profile Page

**Description**: User profile interface showing personal information, with edit capabilities based on user permissions.

**Key Elements to Highlight**:

- User profile information display
- Edit capabilities (for own profile or admin access)
- Back navigation button
- Profile picture and contact information

### Screenshot 8: Project Creation Form

**Description**: The form interface for creating new projects, showing field validation and user assignment capabilities.

**Key Elements to Highlight**:

- Form fields with validation
- Team member selection interface
- Date picker for project timeline
- Save and cancel options

### Screenshot 9: Mobile Responsive View

**Description**: The application displayed on mobile devices, demonstrating responsive design and mobile-optimized navigation.

**Key Elements to Highlight**:

- Mobile navigation menu
- Responsive layout adaptation
- Touch-friendly button sizes
- Optimized mobile user experience

### Screenshot 10: Admin Panel

**Description**: Administrative interface showing user management capabilities available only to admin users.

**Key Elements to Highlight**:

- User management table
- Admin-only action buttons
- Role assignment interface
- System configuration options

---

## Installation Guide

### Prerequisites

Before installing SumaTask, ensure you have the following software installed:

- **Node.js (v16 or higher)**: Download from [nodejs.org](https://nodejs.org/)
- **MongoDB (v4.4 or higher)**: Download from [mongodb.com](https://www.mongodb.com/)
- **Angular CLI (v18 or higher)**: Install via npm: `npm install -g @angular/cli`
- **Git**: For version control and repository cloning

### Backend Setup

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd SumaTask/backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/sumatask
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Database Setup**

   - Start MongoDB service
   - The application will automatically create the database and collections

5. **Start the Backend Server**
   ```bash
   npm start
   ```
   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to Frontend Directory**

   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Update `src/environments/environment.ts`:

   ```typescript
   export const environment = {
     production: false,
     apiUrl: "http://localhost:5000/api",
   };
   ```

4. **Start the Frontend Server**
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:4200`

### Initial Setup

1. **Create Admin User**

   - Register through the application interface
   - Manually update the user role to 'admin' in the database or create a seed script

2. **Verify Installation**
   - Access the application at `http://localhost:4200`
   - Login with your admin credentials
   - Create test projects and tasks to verify functionality

---

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register

Register a new user account

- **Body**: `{ fullName, email, password, role?, department? }`
- **Response**: `{ success, message, data: { user, token } }`

#### POST /api/auth/login

Authenticate user login

- **Body**: `{ email, password }`
- **Response**: `{ success, message, data: { user, token } }`

#### GET /api/auth/me

Get current user profile

- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success, data: { user } }`

### Project Endpoints

#### GET /api/projects

Retrieve all projects (filtered by user permissions)

- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**: `page, limit, search, status, priority`
- **Response**: `{ success, data: { projects, pagination } }`

#### POST /api/projects

Create a new project

- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ name, description, projectManager, teamMembers, startDate, endDate?, budget? }`
- **Response**: `{ success, message, data: { project } }`

#### PUT /api/projects/:id

Update existing project

- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ name?, description?, status?, ... }`
- **Response**: `{ success, message, data: { project } }`

### Task Endpoints

#### GET /api/tasks

Retrieve all tasks (filtered by user permissions)

- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**: `page, limit, status, priority, assignedTo, project`
- **Response**: `{ success, data: { tasks, pagination } }`

#### POST /api/tasks

Create a new task

- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ title, description, assignedTo, project, priority?, dueDate?, tags? }`
- **Response**: `{ success, message, data: { task } }`

#### PUT /api/tasks/:id

Update task (including completion)

- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ title?, description?, status?, priority?, ... }`
- **Response**: `{ success, message, data: { task } }`

### User Endpoints

#### GET /api/users/team-members

Get all team members

- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success, data: { users } }`

#### PUT /api/users/:id

Update user profile

- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ fullName?, email?, department?, role? }`
- **Response**: `{ success, message, data: { user } }`

---

## Conclusion

### Project Achievements

SumaTask successfully demonstrates the implementation of a comprehensive task management system using modern web technologies. The project achieves the following key objectives:

1. **Full-Stack Implementation**: Complete MEAN stack application with separation of concerns
2. **Role-Based Security**: Robust authentication and authorization system
3. **Intuitive User Experience**: Modern, responsive interface with excellent usability
4. **Scalable Architecture**: Well-structured codebase suitable for future enhancements
5. **Real-World Applicability**: Production-ready features addressing actual business needs

### Technical Accomplishments

- **RESTful API Design**: Well-structured API following REST principles
- **Database Design**: Efficient MongoDB schema with proper relationships
- **Frontend Architecture**: Component-based Angular application with proper state management
- **Security Implementation**: JWT authentication with role-based access control
- **Responsive Design**: Mobile-first approach ensuring cross-device compatibility

### Learning Outcomes

This project provided extensive experience in:

- Full-stack web development with the MEAN stack
- Database design and NoSQL implementation
- User authentication and authorization
- Responsive web design and modern UI/UX principles
- API design and documentation
- Project planning and feature implementation

### Future Enhancements

Potential improvements for SumaTask include:

- Real-time notifications using WebSockets
- Advanced reporting and analytics dashboard
- Integration with external calendar systems
- File versioning and collaboration features
- Mobile application development
- Advanced project templates and automation

### Final Thoughts

SumaTask represents a complete, professional-grade task management solution that effectively combines modern web technologies with practical business requirements. The application demonstrates proficiency in full-stack development while addressing real-world needs for project and task management in organizational settings.

---

**Document prepared by:** Muhammed Darboe  
**Date:** June 30, 2025  
**Course:** Web Development 2  
**Institution:** [Your Institution Name]  
**Total Pages:** [To be updated in Word document]
