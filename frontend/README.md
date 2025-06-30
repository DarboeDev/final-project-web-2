# SumaTask - Frontend

SumaTask is a modern, responsive task management application built with Angular 18 and styled with Tailwind CSS. This frontend provides an intuitive interface for managing projects, tasks, and team collaboration.

## Features

### 🔐 Authentication & Authorization

- Secure login and registration
- Role-based access control (Admin, Project Manager, Team Member)
- JWT token-based authentication
- User profile management

### 📋 Task Management

- Complete task with one-click button
- Task status tracking (Pending, In Progress, Completed, Cancelled)
- Priority management (Low, Medium, High, Urgent)
- Task assignment to team members
- Due date management
- Task filtering and search

### 🎯 Project Management

- Project creation and management
- Project status tracking
- Team member assignment
- Project progress monitoring
- Project detail views

### 👥 Team Management

- Team member directory
- User profile viewing and editing (Admin only)
- Active/inactive status tracking
- Project assignment overview

### 🎨 User Interface

- Modern, responsive design with Tailwind CSS
- Dark/light theme support
- Mobile-friendly interface
- Intuitive navigation with sidebar
- Loading states and error handling

## Tech Stack

- **Framework**: Angular 18
- **Styling**: Tailwind CSS, SCSS
- **HTTP Client**: Angular HttpClient with interceptors
- **Routing**: Angular Router with guards
- **State Management**: Services with RxJS
- **Icons**: Heroicons (SVG)
- **Build Tool**: Angular CLI

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── components/          # Reusable components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard view
│   │   ├── layout/         # Navigation and layout
│   │   └── user-profile/   # User profile management
│   ├── pages/              # Main application pages
│   │   ├── projects/       # Project management
│   │   ├── tasks/          # Task management
│   │   ├── team/           # Team management
│   │   └── admin/          # Admin panel
│   ├── services/           # Business logic services
│   ├── guards/             # Route protection
│   ├── interceptors/       # HTTP interceptors
│   └── interfaces/         # TypeScript interfaces
└── styles/                 # Global styles and Tailwind config
```

## Key Features Implemented

### Task Completion System

- **One-Click Completion**: Simple button to mark tasks as completed
- **Role-Based Permissions**: Only assigned users, project managers, and admins can complete tasks
- **Real-time Updates**: Task status updates immediately in the UI

### Team Management

- **User Directory**: View all team members with their details
- **Profile Management**: Admins can edit user profiles
- **Back Navigation**: Easy navigation between team view and profile pages
- **Status Tracking**: Clear indication of user activity status

### Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Flexible Layouts**: Grid and flexbox layouts that adapt to screen size
- **Consistent Styling**: Unified design system with Tailwind CSS

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Navigate to `http://localhost:4200/`

## Environment Configuration

Update `src/environments/environment.ts` with your backend API URL:

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:5000/api",
};
```

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
