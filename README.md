# SumaTask - Modern Task Management System

![SumaTask Logo](https://via.placeholder.com/300x100/4F46E5/FFFFFF?text=SumaTask)

## Overview

SumaTask is a comprehensive, modern task management system built with the MEAN stack (MongoDB, Express.js, Angular, Node.js). It provides organizations with powerful tools to manage projects, tasks, and team collaboration efficiently with role-based access control and intuitive user interfaces.

## 🚀 Key Features

### 🔐 Authentication & Security

- **JWT-based Authentication**: Secure token-based authentication
- **Role-based Access Control**: Admin, Project Manager, and Team Member roles
- **Secure Password Management**: Bcrypt encryption and password reset functionality
- **Protected Routes**: Frontend and backend route protection

### � Smart Task Management

- **One-Click Task Completion**: Simple, intuitive task completion for authorized users
- **Smart Permissions**: Only assigned users, project managers, and admins can complete tasks
- **Task Status Tracking**: Pending, In Progress, Completed, Cancelled
- **Priority Management**: Low, Medium, High, Urgent priority levels
- **Due Date Management**: Track and manage task deadlines
- **Task Assignment**: Assign tasks to specific team members

### 🎯 Project Management

- **Complete Project Lifecycle**: Planning, Active, On Hold, Completed, Cancelled
- **Team Management**: Assign team members and project managers
- **Progress Tracking**: Monitor project completion and milestones
- **Budget Management**: Track project budgets and expenses
- **Project Dashboard**: Comprehensive project overview

### 👥 Team Collaboration

- **Team Directory**: View all team members and their details
- **User Profile Management**: Comprehensive user profiles with editing capabilities
- **Status Tracking**: Active/inactive user status monitoring
- **Project Assignment Overview**: See which projects each team member is working on
- **Easy Navigation**: Intuitive back buttons and navigation flow

### 🎨 Modern User Interface

- **Responsive Design**: Mobile-first, works on all devices
- **Tailwind CSS**: Modern, utility-first styling
- **Intuitive Navigation**: Clean sidebar navigation with active states
- **Loading States**: Smooth loading indicators and error handling
- **Accessibility**: ARIA labels and keyboard navigation support

### 🏷️ Category Management

- **Color-coded Categories**: Organize tasks with visual categorization
- **Custom Category Creation**: Create and manage custom categories
- **Category-based Filtering**: Filter tasks by categories

### � Analytics & Reporting

- **Dashboard Analytics**: Project and task completion statistics
- **Progress Tracking**: Visual progress indicators
- **Performance Metrics**: Track team productivity

## 🛠 Technology Stack

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - ODM for MongoDB with schema validation
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing and security
- **Multer** - File upload handling

### Frontend

- **Angular 18** - Modern web framework with TypeScript
- **Tailwind CSS** - Utility-first CSS framework
- **RxJS** - Reactive programming for async operations
- **Angular Router** - Client-side routing with guards
- **Angular HTTP Client** - API communication with interceptors

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Angular CLI (v18 or higher)

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env` file with:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/sumatask
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:5000

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Projects

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/tasks` - Get project tasks

### Tasks

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/my-tasks` - Get user's tasks
- `POST /api/tasks/:id/comments` - Add comment
- `POST /api/tasks/:id/attachments` - Upload attachment

### Users

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/team-members` - Get team members

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## 👥 User Roles & Permissions

### Admin

- ✅ Full system access
- ✅ User management (create, edit, delete users)
- ✅ Project management across all projects
- ✅ Task completion for all tasks
- ✅ System configuration

### Project Manager

- ✅ Manage assigned projects
- ✅ Create and assign tasks within their projects
- ✅ Complete tasks within their projects
- ✅ Manage team members for their projects
- ✅ View project analytics

### Team Member

- ✅ View assigned tasks and projects
- ✅ Complete assigned tasks
- ✅ Update task progress
- ✅ View team directory
- ✅ Manage personal profile

## 🎯 Key Features Deep Dive

### Task Completion System

The task completion system is designed for simplicity and security:

- **One-Click Completion**: Users can complete tasks with a single button click
- **Smart Permissions**: The system automatically determines who can complete each task:
  - ✅ Assigned user can complete their tasks
  - ✅ Project manager can complete any task in their project
  - ✅ Admin can complete any task in the system
- **Real-time Updates**: Task status updates immediately across the interface
- **Visual Feedback**: Clear visual indicators for task status

### Team Management Features

- **Team Directory**: Visual cards showing all team members
- **Profile Management**: Detailed user profiles with editing capabilities (admin only)
- **Status Indicators**: Clear active/inactive status with proper data handling
- **Project Overview**: See which projects each team member is working on
- **Easy Navigation**: Back buttons and intuitive flow between team and profile views

## 📱 User Interface

### Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Flexible Layouts**: Grid and flexbox layouts that adapt to screen size
- **Touch-Friendly**: Large touch targets for mobile devices
- **Consistent Styling**: Unified design system with Tailwind CSS

### Modern Features

- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time form validation
- **Accessibility**: ARIA labels and keyboard navigation

## 🔧 Development Commands

### Frontend Development

```bash
cd frontend
npm start              # Start development server
npm run build          # Build for production
npm run test           # Run unit tests
npm run lint           # Lint code
```

### Backend Development

```bash
cd backend
npm start              # Start server
npm run dev            # Start with nodemon (auto-reload)
npm test               # Run tests
```

## 🚀 Deployment

### Production Environment

1. Set production environment variables
2. Build frontend: `npm run build`
3. Deploy backend to your server
4. Configure your web server to serve the Angular app
5. Set up MongoDB in production

### Environment Variables

```env
# Backend
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sumatask
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
NODE_ENV=production

# Frontend
API_URL=https://your-api-domain.com/api
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📞 Support

For support or questions about SumaTask, please create an issue on GitHub.

---

**SumaTask** - Streamline your workflow, enhance productivity, and achieve your goals with modern task management.
#   f i n a l - p r o j e c t - w e b - 2  
 