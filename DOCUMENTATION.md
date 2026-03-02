# TaskFlow — Complete Project Documentation

> **A Production-Ready To-Do Application**  
> Built with FastAPI + MongoDB + React  
> Developer: Gourav Mishra | [gouravm19](https://github.com/gouravm19)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [SDLC Process Followed](#2-sdlc-process-followed)
3. [Tech Stack — Complete Details](#3-tech-stack--complete-details)
4. [Architecture](#4-architecture)
5. [Database Design](#5-database-design)
6. [API Documentation](#6-api-documentation)
7. [Security Implementation](#7-security-implementation)
8. [Testing Documentation](#8-testing-documentation)
9. [CI/CD Pipeline](#9-cicd-pipeline)
10. [Local Development Setup](#10-local-development-setup--complete-guide)
11. [User Guide](#11-user-guide-end-user-documentation)
12. [Troubleshooting Guide](#12-troubleshooting-guide)
13. [Future Enhancements](#13-future-enhancements-roadmap)
14. [Contributing Guide](#14-contributing-guide)
15. [Deployment Guide](#15-deployment-guide-production)
16. [Project Metrics](#16-project-metrics)
17. [About the Developer](#17-about-the-developer)

---

## 1. Project Overview

### What the Application Does

TaskFlow is a comprehensive task management application designed to help individuals and professionals organize their daily activities, track progress, and boost productivity. The application provides a modern, intuitive interface for creating, organizing, and completing tasks with features like categorization, priority levels, due date tracking, and smart notifications.

The application follows the complete Software Development Life Cycle (SDLC) from requirements gathering through deployment, demonstrating enterprise-grade software engineering practices suitable for portfolio presentation and technical interviews.

### Target Users

| User Persona | Description | Key Needs |
|--------------|-------------|-----------|
| **Busy Professionals** | Working individuals managing multiple projects | Quick task entry, priority management, deadline tracking |
| **Students** | Students organizing assignments and study schedules | Category-based organization, due date reminders |
| **Freelancers** | Self-employed individuals managing client work | Task filtering, progress tracking, category separation |
| **Team Leads** | Managers tracking personal and team deliverables | Dashboard overview, statistics, completion rates |

### Business Problem Solved

In today's fast-paced environment, professionals struggle with:
- **Information Overload**: Too many tasks scattered across different tools
- **Missed Deadlines**: Lack of timely reminders for upcoming due dates
- **Poor Organization**: No structured way to categorize and prioritize work
- **Progress Blindness**: Unable to visualize completion rates and productivity

TaskFlow solves these problems by providing a unified, visually appealing platform that centralizes task management with intelligent categorization, priority-based sorting, and automated reminders.

### Key Value Proposition

| Feature | Value |
|---------|-------|
| **Unified Dashboard** | See everything at a glance — stats, pinned tasks, today's tasks, overdue items |
| **Smart Categorization** | Organize tasks by Work, Personal, Health, Shopping with custom categories |
| **Priority System** | Four-level priority (Low, Medium, High, Urgent) with visual indicators |
| **Automated Reminders** | Email notifications 24 hours before task due dates |
| **Progress Tracking** | Visual charts showing completion rates and productivity trends |
| **Mobile Responsive** | Full functionality on desktop, tablet, and mobile devices |

---

## 2. SDLC Process Followed

### 2.1 Requirements Gathering

#### Client's Original Requirements

The original requirements document specified building a "complete, production-ready To-Do List Web Application" with the following high-level requirements:

1. **User Authentication System**
   - User registration with email verification
   - Secure login with JWT tokens
   - Password reset functionality via email OTP
   - Remember me functionality

2. **Task Management**
   - Full CRUD operations for tasks
   - Priority levels (Low, Medium, High, Urgent)
   - Status tracking (Pending, In Progress, Completed, Cancelled)
   - Due date assignment with reminders
   - Task pinning for important items

3. **Organization Features**
   - Category-based task organization
   - Default categories (Work, Personal, Shopping, Health)
   - Custom category creation with colors and icons

4. **Dashboard & Analytics**
   - Overview statistics (total, completed, overdue, due this week)
   - Visual progress charts
   - Quick access to pinned, today's, and overdue tasks

5. **Notifications**
   - In-app notification system
   - Email reminders for upcoming due dates
   - Welcome emails for new users

#### Requirements Refinement Process

The requirements were refined through the following process:

1. **Stakeholder Analysis**: Identified primary users (professionals, students) and their needs
2. **Feature Prioritization**: Used MoSCoW method to categorize features
3. **Technical Feasibility**: Assessed technology options (FastAPI vs Spring Boot, MongoDB vs PostgreSQL)
4. **Scope Definition**: Defined MVP features vs future enhancements

### 2.2 Software Requirements Specification (SRS)

#### Purpose and Scope

**Purpose**: To provide a detailed specification of the TaskFlow application's functional and non-functional requirements, serving as a contract between stakeholders and the development team.

**Scope**: The TaskFlow application encompasses user authentication, task management, category organization, notification systems, and analytics dashboards. The system supports single-user task management with plans for future team collaboration features.

#### Functional Requirements

| FR ID | Requirement | Description | Priority | Status |
|-------|-------------|-------------|----------|--------|
| FR1.1 | User Registration | Users can create accounts with username, email, password | MUST HAVE | ✅ Implemented |
| FR1.2 | User Login | Users can authenticate with email/username and password | MUST HAVE | ✅ Implemented |
| FR1.3 | Password Reset | Users can reset password via email OTP | MUST HAVE | ✅ Implemented |
| FR1.4 | JWT Authentication | Stateless authentication with access/refresh tokens | MUST HAVE | ✅ Implemented |
| FR1.5 | Profile Management | Users can update profile information | SHOULD HAVE | ✅ Implemented |
| FR1.6 | Password Change | Users can change password from profile | SHOULD HAVE | ✅ Implemented |
| FR2.1 | Create Task | Users can create tasks with title, description, priority, due date | MUST HAVE | ✅ Implemented |
| FR2.2 | Read Tasks | Users can view all their tasks with pagination | MUST HAVE | ✅ Implemented |
| FR2.3 | Update Task | Users can modify task details | MUST HAVE | ✅ Implemented |
| FR2.4 | Delete Task | Users can delete tasks | MUST HAVE | ✅ Implemented |
| FR2.5 | Task Filtering | Users can filter tasks by status, priority, category, due date | MUST HAVE | ✅ Implemented |
| FR2.6 | Task Search | Users can search tasks by title/description | MUST HAVE | ✅ Implemented |
| FR2.7 | Task Sorting | Users can sort tasks by various fields | SHOULD HAVE | ✅ Implemented |
| FR2.8 | Task Pinning | Users can pin important tasks | SHOULD HAVE | ✅ Implemented |
| FR2.9 | Task Status Update | Users can toggle task completion | MUST HAVE | ✅ Implemented |
| FR3.1 | Default Categories | System provides default categories on registration | MUST HAVE | ✅ Implemented |
| FR3.2 | Create Category | Users can create custom categories | SHOULD HAVE | ✅ Implemented |
| FR3.3 | Update Category | Users can modify category details | SHOULD HAVE | ✅ Implemented |
| FR3.4 | Delete Category | Users can delete empty categories | SHOULD HAVE | ✅ Implemented |
| FR4.1 | Dashboard Stats | Display task statistics (total, completed, overdue) | MUST HAVE | ✅ Implemented |
| FR4.2 | Progress Chart | Visual donut chart showing task distribution | SHOULD HAVE | ✅ Implemented |
| FR4.3 | Pinned Section | Quick view of pinned tasks | SHOULD HAVE | ✅ Implemented |
| FR4.4 | Today's Tasks | List of tasks due today | MUST HAVE | ✅ Implemented |
| FR4.5 | Overdue Tasks | Highlight overdue tasks | MUST HAVE | ✅ Implemented |
| FR5.1 | In-App Notifications | Notification panel in navbar | SHOULD HAVE | ✅ Implemented |
| FR5.2 | Email Reminders | Email 24 hours before due date | SHOULD HAVE | ✅ Implemented |
| FR5.3 | Welcome Email | Send welcome email on registration | COULD HAVE | ✅ Implemented |
| FR5.4 | Mark as Read | Users can mark notifications as read | SHOULD HAVE | ✅ Implemented |

#### Non-Functional Requirements

| NFR ID | Requirement | Description | How Implemented |
|--------|-------------|-------------|-----------------|
| NFR1.1 | Security - Authentication | Secure user authentication | JWT with HS512 algorithm, 15-min access tokens |
| NFR1.2 | Security - Password Storage | Secure password storage | BCrypt hashing with cost factor 12 |
| NFR1.3 | Security - Token Management | Prevent token theft | Refresh token rotation, database storage |
| NFR1.4 | Security - Input Validation | Prevent injection attacks | Pydantic validation, parameterized MongoDB queries |
| NFR2.1 | Performance - Response Time | API response under 200ms | Async FastAPI, MongoDB indexes |
| NFR2.2 | Performance - Database | Efficient database queries | Proper indexing on frequently queried fields |
| NFR2.3 | Performance - Frontend | Fast page loads | React Query caching, optimistic updates |
| NFR3.1 | Usability - Responsive Design | Work on all screen sizes | Tailwind CSS responsive classes, mobile nav |
| NFR3.2 | Usability - Accessibility | WCAG 2.1 compliance | Semantic HTML, ARIA labels, keyboard navigation |
| NFR3.3 | Usability - Intuitive UI | Minimal learning curve | Consistent design patterns, clear visual hierarchy |
| NFR4.1 | Reliability - Availability | High uptime | Stateless backend, database replication ready |
| NFR4.2 | Reliability - Data Integrity | No data loss | MongoDB transactions, proper error handling |
| NFR5.1 | Maintainability - Code Quality | Clean, readable code | PEP 8 standards, ESLint, component-based architecture |
| NFR5.2 | Maintainability - Documentation | Comprehensive docs | OpenAPI/Swagger, inline comments, README |
| NFR6.1 | Scalability - Horizontal | Support multiple instances | Stateless JWT, external MongoDB |

### 2.3 Agile Planning

#### Epics

| Epic ID | Epic Name | Description |
|---------|-----------|-------------|
| E1 | User Authentication | Complete authentication system including registration, login, logout, password reset |
| E2 | Task Management | Core task CRUD operations with filtering, sorting, and search |
| E3 | Category System | Category management for task organization |
| E4 | Dashboard & Analytics | Statistics dashboard with visual charts and quick-access sections |
| E5 | Notification System | In-app and email notification functionality |
| E6 | User Profile | Profile management and password change features |

#### User Stories

| Story ID | As a... | I want to... | So that... | Story Points | Sprint | Status |
|----------|---------|--------------|------------|--------------|--------|--------|
| US1.1 | new user | create an account with my email | I can access the task management features | 3 | 1 | ✅ Done |
| US1.2 | registered user | log in with my credentials | I can access my tasks securely | 2 | 1 | ✅ Done |
| US1.3 | forgetful user | reset my password via email OTP | I can regain access to my account | 5 | 1 | ✅ Done |
| US1.4 | logged-in user | stay logged in for extended periods | I don't have to log in every time | 3 | 1 | ✅ Done |
| US2.1 | user | create a new task with details | I can track things I need to do | 3 | 1 | ✅ Done |
| US2.2 | user | view all my tasks in a list | I can see everything I need to accomplish | 2 | 1 | ✅ Done |
| US2.3 | user | edit my existing tasks | I can update task information as needed | 2 | 1 | ✅ Done |
| US2.4 | user | delete tasks I no longer need | I can keep my task list clean | 1 | 1 | ✅ Done |
| US2.5 | user | filter tasks by status and priority | I can focus on specific task types | 3 | 1 | ✅ Done |
| US2.6 | user | search tasks by keyword | I can quickly find specific tasks | 2 | 1 | ✅ Done |
| US2.7 | user | mark tasks as complete | I can track my progress | 2 | 1 | ✅ Done |
| US2.8 | user | pin important tasks | I can quickly access high-priority items | 2 | 2 | ✅ Done |
| US3.1 | new user | have default categories created | I can immediately start organizing tasks | 2 | 1 | ✅ Done |
| US3.2 | user | create custom categories | I can organize tasks my way | 3 | 2 | ✅ Done |
| US3.3 | user | assign tasks to categories | I can keep tasks organized | 2 | 1 | ✅ Done |
| US4.1 | user | see my task statistics | I can understand my productivity | 3 | 2 | ✅ Done |
| US4.2 | user | see a visual progress chart | I can quickly gauge completion rates | 3 | 2 | ✅ Done |
| US4.3 | user | see today's tasks prominently | I know what to focus on today | 2 | 2 | ✅ Done |
| US4.4 | user | see overdue tasks highlighted | I can address missed deadlines | 2 | 2 | ✅ Done |
| US5.1 | user | receive email reminders | I don't miss important deadlines | 5 | 2 | ✅ Done |
| US5.2 | user | see in-app notifications | I'm informed of important updates | 3 | 2 | ✅ Done |
| US6.1 | user | update my profile information | I can keep my account details current | 2 | 2 | ✅ Done |
| US6.2 | user | change my password | I can maintain account security | 3 | 2 | ✅ Done |

#### Sprint Planning

**Sprint 1 (Week 1): Core Functionality**
- Epic E1: User Authentication (complete)
- Epic E2: Task Management (basic CRUD)
- Epic E3: Category System (default categories)

**Sprint 2 (Week 2): Enhanced Features**
- Epic E2: Task Management (advanced filtering, search, pinning)
- Epic E3: Category System (custom categories)
- Epic E4: Dashboard & Analytics (complete)
- Epic E5: Notification System (complete)
- Epic E6: User Profile (complete)

#### Definition of Done

A feature is considered "Done" when:

- [ ] Code is complete and follows coding standards
- [ ] Unit tests written with >80% coverage
- [ ] Integration tests pass
- [ ] API documentation updated (Swagger)
- [ ] Code reviewed by peer
- [ ] No critical or high-severity bugs
- [ ] Feature tested on development environment
- [ ] User acceptance criteria met
- [ ] Documentation updated

### 2.4 Design Phase

#### Database Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Database Type | MongoDB (NoSQL) | Flexible schema for evolving task attributes, easy JSON document handling |
| ID Strategy | UUID strings | Cleaner API responses than ObjectId, no serialization issues |
| DateTime Storage | ISO 8601 strings | Timezone-aware, human-readable, consistent across systems |
| Soft Delete | Not implemented | Simplicity for MVP; tasks are permanently deleted |
| Category Ownership | Per-user categories | Privacy, allows customization without affecting other users |
| Token Storage | Separate collection | Clean separation, easy revocation, audit trail |

#### API Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Architecture Style | REST | Industry standard, stateless, cacheable |
| Authentication | Bearer JWT | Stateless, scalable, industry standard |
| Versioning | Not implemented (MVP) | Single version for MVP; URL versioning planned |
| Response Format | Direct JSON | Consistent structure, easy frontend parsing |
| Error Format | Standard HTTP + JSON | Clear error types, actionable messages |
| Pagination | Offset-based | Simple implementation, sufficient for MVP scale |

#### UI/UX Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Design System | Custom dark theme | Modern aesthetic, reduced eye strain |
| Component Library | Shadcn/UI | High-quality, customizable, Tailwind-compatible |
| Color Palette | Slate + Blue primary | Professional, accessible, consistent |
| Typography | Inter font | Modern, highly readable, free |
| Layout | Sidebar + Main content | Familiar pattern, efficient navigation |
| Mobile Strategy | Responsive + Bottom nav | Optimal experience on all devices |

### 2.5 Development Phase

#### Coding Standards

**Backend (Python/FastAPI)**:
- Follow PEP 8 style guide
- Use type hints for all function parameters and returns
- Async/await for all database operations
- Pydantic models for request/response validation
- Structured logging (not print statements)
- Environment variables for configuration

**Frontend (React/JavaScript)**:
- ESLint configuration enforced
- Component-based architecture
- Custom hooks for reusable logic
- TanStack Query for server state
- Zustand for client state
- Named exports for components, default for pages

#### Code Review Checklist

- [ ] Code follows established patterns
- [ ] No hardcoded values (use environment variables)
- [ ] Proper error handling
- [ ] Input validation present
- [ ] Security considerations addressed
- [ ] Tests written/updated
- [ ] No console.log/print statements in production code
- [ ] Documentation updated if API changed

#### Git Branching Strategy

```
main (production-ready)
│
├── develop (integration branch)
│   │
│   ├── feature/auth-system
│   ├── feature/task-crud
│   ├── feature/dashboard
│   └── feature/notifications
│
├── bugfix/login-error
└── hotfix/security-patch
```

### 2.6 Testing Phase

#### Testing Strategy

| Level | Type | Tools | Coverage Target |
|-------|------|-------|-----------------|
| Unit | Service layer testing | pytest, unittest.mock | 80%+ |
| Integration | API endpoint testing | pytest, httpx | All endpoints |
| E2E | User flow testing | Playwright | Critical paths |
| Manual | Exploratory testing | Browser | Edge cases |

#### Types of Testing Performed

1. **Unit Testing**: Individual function testing with mocked dependencies
2. **Integration Testing**: API endpoint testing with test database
3. **Frontend Testing**: Component rendering and interaction testing
4. **Manual Testing**: Cross-browser, responsive design, usability

### 2.7 Deployment Phase

#### Containerization Approach

The application uses Docker for containerization:

- **Backend**: Python 3.11 slim image with FastAPI
- **Frontend**: Node.js build + Nginx for serving
- **Database**: MongoDB official image
- **Email Testing**: MailHog for local development

#### Environment Configuration

| Environment | Database | Email | Debug |
|-------------|----------|-------|-------|
| Development | MongoDB local | Console logging | Enabled |
| Testing | MongoDB test DB | Mocked | Enabled |
| Production | MongoDB Atlas | Resend API | Disabled |

---

## 3. Tech Stack — Complete Details

### 3.1 Backend Technology Decisions

| Technology | Version | Purpose | Why Chosen Over Alternatives |
|------------|---------|---------|------------------------------|
| **Python** | 3.11+ | Programming Language | Rapid development, excellent async support, rich ecosystem |
| **FastAPI** | 0.100+ | Web Framework | Native async, automatic OpenAPI, Pydantic integration, high performance |
| **Motor** | 3.3+ | MongoDB Async Driver | Native async support for MongoDB, perfect for FastAPI |
| **MongoDB** | 7.0 | Database | Flexible schema, document model fits task data, scalable |
| **Pydantic** | 2.0+ | Data Validation | Type-safe, automatic validation, serialization |
| **python-jose** | 3.3+ | JWT Handling | Lightweight, supports multiple algorithms |
| **passlib[bcrypt]** | 1.7+ | Password Hashing | Industry-standard BCrypt, adaptive cost factor |
| **APScheduler** | 3.10+ | Task Scheduling | Background jobs for email reminders |
| **Resend** | 2.0+ | Email Service | Modern API, great developer experience, generous free tier |
| **slowapi** | 0.1+ | Rate Limiting | FastAPI-native, Redis-compatible |
| **uvicorn** | 0.23+ | ASGI Server | High-performance, production-ready |

#### Why FastAPI over Spring Boot?

| Aspect | FastAPI | Spring Boot |
|--------|---------|-------------|
| Development Speed | Faster (Python, less boilerplate) | Slower (Java verbosity) |
| Performance | High (async native) | High (JVM optimized) |
| Learning Curve | Lower | Higher |
| Type Safety | Via Pydantic | Native Java types |
| Documentation | Auto-generated OpenAPI | Requires SpringDoc |
| Deployment | Lightweight containers | Heavier JVM containers |

For this portfolio project, FastAPI was chosen for rapid development while maintaining production-quality code.

### 3.2 Frontend Technology Decisions

| Technology | Version | Purpose | Why Chosen Over Alternatives |
|------------|---------|---------|------------------------------|
| **React** | 18.x | UI Framework | Component model, massive ecosystem, industry standard |
| **JavaScript/JSX** | ES2022 | Language | Universal browser support, rapid development |
| **Tailwind CSS** | 3.x | Styling | Utility-first, no CSS files, highly customizable |
| **React Router** | 6.x | Client Routing | Declarative, nested routes, loader support |
| **TanStack Query** | 5.x | Server State | Caching, background sync, loading states |
| **Zustand** | 5.x | Client State | Simple API, no boilerplate, TypeScript support |
| **Axios** | 1.x | HTTP Client | Interceptors, request/response transforms |
| **React Hook Form** | 7.x | Form Handling | Performance, validation, minimal re-renders |
| **Zod** | 3.x | Schema Validation | TypeScript-first, composable schemas |
| **Lucide React** | Latest | Icons | Tree-shakeable, consistent design |
| **React Hot Toast** | 2.x | Notifications | Accessible, customizable, lightweight |
| **date-fns** | 3.x | Date Formatting | Lightweight, tree-shakeable (vs Moment.js) |
| **Recharts** | 2.x | Charts | React-native, declarative, responsive |
| **Framer Motion** | 11.x | Animations | Declarative, performant, React-native |

#### Why TanStack Query over Redux?

| Aspect | TanStack Query | Redux |
|--------|----------------|-------|
| Purpose | Server state | All state |
| Boilerplate | Minimal | High |
| Caching | Built-in | Manual |
| Background Sync | Automatic | Manual |
| Learning Curve | Lower | Higher |
| Bundle Size | Smaller | Larger with toolkit |

TanStack Query is purpose-built for server state management, which is the primary state type in TaskFlow.

### 3.3 Infrastructure & DevOps

| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **Docker** | Containerization | Consistent environments, easy deployment |
| **Docker Compose** | Multi-container | Local development orchestration |
| **MongoDB** | Primary Database | Document model, scalability |
| **Nginx** | Reverse Proxy | Static file serving, gzip compression |
| **GitHub Actions** | CI/CD | Free for public repos, GitHub integration |
| **MailHog** | Email Testing | Captures all emails locally for testing |

---

## 4. Architecture

### 4.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                               │
│                                                                      │
│   ┌──────────────────────────────────────────────────────────────┐  │
│   │                    React 18 Application                       │  │
│   │         Tailwind CSS + TanStack Query + Zustand              │  │
│   │                      (port 3000)                              │  │
│   └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              │ HTTPS / REST API
                              │ Authorization: Bearer {JWT}
                              │
┌─────────────────────────────▼───────────────────────────────────────┐
│                       FastAPI BACKEND                                │
│                        (port 8001)                                   │
│                                                                      │
│   ┌────────────────────────────────────────────────────────────┐    │
│   │                    API Layer (Routers)                      │    │
│   │  ┌──────────┐  ┌──────────┐  ┌────────────┐  ┌──────────┐ │    │
│   │  │   Auth   │  │  Tasks   │  │ Categories │  │  Users   │ │    │
│   │  │  Router  │  │  Router  │  │   Router   │  │  Router  │ │    │
│   │  └────┬─────┘  └────┬─────┘  └─────┬──────┘  └────┬─────┘ │    │
│   └───────┼─────────────┼──────────────┼─────────────┼────────┘    │
│           │             │              │             │              │
│   ┌───────▼─────────────▼──────────────▼─────────────▼────────┐    │
│   │                  Service Layer                             │    │
│   │    • Business Logic    • Email Service    • JWT Utils     │    │
│   └───────────────────────────┬────────────────────────────────┘    │
│                               │                                      │
│   ┌───────────────────────────▼────────────────────────────────┐    │
│   │              Data Access Layer (Motor/MongoDB)              │    │
│   │         • Pydantic Models    • Database Utils              │    │
│   └───────────────────────────┬────────────────────────────────┘    │
└───────────────────────────────┼─────────────────────────────────────┘
                                │
           ┌────────────────────┼────────────────────┐
           │                    │                    │
    ┌──────▼──────┐     ┌───────▼───────┐    ┌──────▼──────┐
    │   MongoDB   │     │    Resend     │    │  APScheduler │
    │  Database   │     │  Email API    │    │   (Hourly)   │
    │ (port 27017)│     │  (External)   │    │  Reminders   │
    └─────────────┘     └───────────────┘    └──────────────┘
```

### 4.2 Folder Structure Explanation

#### Backend Structure

```
/app/backend/
├── server.py              # Main FastAPI application entry point
│                          # - App initialization
│                          # - Middleware configuration
│                          # - Router registration
│                          # - Lifespan events (startup/shutdown)
│                          # - Global exception handlers
│
├── routers/               # API Route Handlers (Controller Layer)
│   ├── __init__.py        # Router exports
│   ├── auth.py            # Authentication endpoints
│   │                      # POST /auth/register, /auth/login, etc.
│   ├── tasks.py           # Task CRUD endpoints
│   │                      # GET/POST/PUT/DELETE /tasks
│   ├── categories.py      # Category management endpoints
│   ├── notifications.py   # Notification endpoints
│   └── users.py           # User profile endpoints
│
├── models/                # Data Models (Domain Layer)
│   ├── __init__.py        # Model exports
│   ├── user.py            # User, RefreshToken, PasswordResetToken
│   ├── task.py            # Task model with enums (Status, Priority)
│   ├── category.py        # Category model
│   └── notification.py    # Notification model with types
│
├── schemas/               # Request/Response Schemas (DTO Layer)
│   ├── __init__.py        # Schema exports
│   ├── auth.py            # Auth request/response schemas
│   ├── task.py            # Task schemas with validation
│   ├── category.py        # Category schemas
│   └── notification.py    # Notification schemas
│
├── services/              # Business Logic Layer
│   ├── __init__.py        # Service exports
│   └── email_service.py   # Email sending logic (Resend + fallback)
│
├── utils/                 # Utility Functions
│   ├── __init__.py        # Utility exports
│   ├── jwt.py             # JWT creation and verification
│   ├── password.py        # BCrypt hashing utilities
│   └── database.py        # MongoDB connection and helpers
│
├── requirements.txt       # Python dependencies
└── .env                   # Environment variables
```

**Why This Structure?**

- **Separation of Concerns**: Each layer has a single responsibility
- **Testability**: Services can be unit tested with mocked dependencies
- **Maintainability**: Changes in one layer don't affect others
- **Scalability**: Easy to add new routers/models without restructuring

#### Frontend Structure

```
/app/frontend/
├── src/
│   ├── App.js             # Root component with routing
│   ├── App.css            # Root styles
│   ├── index.js           # Application entry point
│   ├── index.css          # Global styles + Tailwind imports
│   │
│   ├── api/               # API Communication Layer
│   │   ├── axiosConfig.js # Axios instance with interceptors
│   │   │                  # - Base URL configuration
│   │   │                  # - JWT token injection
│   │   │                  # - 401 handling + token refresh
│   │   ├── authApi.js     # Authentication API calls
│   │   ├── taskApi.js     # Task CRUD API calls
│   │   ├── categoryApi.js # Category API calls
│   │   ├── notificationApi.js # Notification API calls
│   │   └── userApi.js     # User profile API calls
│   │
│   ├── components/        # Reusable UI Components
│   │   ├── layout/        # Layout components
│   │   │   ├── Navbar.jsx       # Top navigation bar
│   │   │   ├── Sidebar.jsx      # Left sidebar with nav
│   │   │   ├── BottomNav.jsx    # Mobile bottom navigation
│   │   │   └── ProtectedRoute.jsx # Auth guard component
│   │   │
│   │   ├── tasks/         # Task-related components
│   │   │   ├── TaskCard.jsx     # Single task display
│   │   │   ├── TaskList.jsx     # Task list with loading
│   │   │   ├── TaskForm.jsx     # Create/edit task modal
│   │   │   ├── TaskFilters.jsx  # Filter controls
│   │   │   └── TaskStats.jsx    # Statistics cards
│   │   │
│   │   ├── auth/          # Authentication components
│   │   │   ├── LoginForm.jsx    # Login form
│   │   │   └── RegisterForm.jsx # Registration form
│   │   │
│   │   └── ui/            # Shadcn UI components
│   │       ├── button.jsx
│   │       ├── input.jsx
│   │       ├── card.jsx
│   │       └── ...        # Other UI primitives
│   │
│   ├── pages/             # Page Components (Routes)
│   │   ├── LoginPage.jsx        # /login
│   │   ├── RegisterPage.jsx     # /register
│   │   ├── ForgotPasswordPage.jsx # /forgot-password
│   │   ├── DashboardPage.jsx    # /dashboard
│   │   ├── TasksPage.jsx        # /tasks
│   │   └── ProfilePage.jsx      # /profile
│   │
│   ├── hooks/             # Custom React Hooks
│   │   ├── useTasks.js    # Task queries and mutations
│   │   ├── useCategories.js # Category queries
│   │   ├── useNotifications.js # Notification queries
│   │   └── useAuth.js     # Auth-related hooks
│   │
│   ├── store/             # State Management
│   │   └── authStore.js   # Zustand store for auth state
│   │
│   ├── types/             # Type Definitions
│   │   └── index.js       # Enums and constants
│   │
│   ├── utils/             # Utility Functions
│   │   ├── dateUtils.js   # Date formatting helpers
│   │   └── validationSchemas.js # Zod validation schemas
│   │
│   └── lib/               # Library configurations
│       └── utils.js       # cn() helper for classnames
│
├── public/                # Static assets
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
└── .env                   # Frontend environment variables
```

**Why This Structure?**

- **Feature-Based Organization**: Related code is grouped together
- **Component Reusability**: UI components are independent and reusable
- **State Management Separation**: Server state (TanStack Query) vs client state (Zustand)
- **Clear Data Flow**: API → Hooks → Components → Pages

### 4.3 Authentication Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                         LOGIN FLOW                                │
└──────────────────────────────────────────────────────────────────┘

User enters credentials
        │
        ▼
┌───────────────────────┐
│ Frontend: LoginForm   │
│ POST /api/auth/login  │
│ {email, password}     │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────────────────────────────────────────────┐
│                    Backend: Auth Router                        │
├───────────────────────────────────────────────────────────────┤
│ 1. Query MongoDB: Find user by email                          │
│ 2. If not found → Return 401 "Invalid credentials"            │
│ 3. BCrypt verify password against stored hash                  │
│ 4. If mismatch → Return 401 "Invalid credentials"             │
│ 5. If user disabled → Return 401 "Account disabled"           │
└───────────────────────────┬───────────────────────────────────┘
                            │ Credentials Valid
                            ▼
┌───────────────────────────────────────────────────────────────┐
│                    Token Generation                            │
├───────────────────────────────────────────────────────────────┤
│ Access Token (JWT):                                            │
│   • Algorithm: HS512                                           │
│   • Payload: {sub: user_id, type: "access", jti: uuid}        │
│   • Expiry: 15 minutes                                         │
│                                                                │
│ Refresh Token (JWT):                                           │
│   • Algorithm: HS512                                           │
│   • Payload: {sub: user_id, type: "refresh", jti: uuid}       │
│   • Expiry: 7 days                                             │
│   • SHA256 hash stored in MongoDB refresh_tokens collection    │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────────┐
│                    Response to Frontend                        │
│                                                                │
│ {                                                              │
│   "access_token": "eyJhbGciOiJIUzUxMiIs...",                  │
│   "refresh_token": "eyJhbGciOiJIUzUxMiIs...",                 │
│   "token_type": "bearer",                                      │
│   "user": {                                                    │
│     "id": "uuid",                                              │
│     "username": "johndoe",                                     │
│     "email": "john@example.com",                               │
│     "first_name": "John",                                      │
│     "last_name": "Doe"                                         │
│   }                                                            │
│ }                                                              │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────────┐
│                    Frontend Storage                            │
├───────────────────────────────────────────────────────────────┤
│ • localStorage: accessToken, refreshToken                      │
│ • Zustand store: user object, isAuthenticated flag            │
│ • Axios interceptor: Adds "Authorization: Bearer {token}"     │
└───────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                    TOKEN REFRESH FLOW                             │
└──────────────────────────────────────────────────────────────────┘

API request returns 401 (token expired)
        │
        ▼
┌───────────────────────┐
│ Axios Interceptor     │
│ Catches 401 error     │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────────────────────────────────────────────┐
│ POST /api/auth/refresh                                         │
│ Body: {refresh_token: "eyJ..."}                               │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────────┐
│ Backend validates refresh token:                               │
│ 1. Verify JWT signature and expiry                            │
│ 2. Hash token and check in MongoDB                            │
│ 3. Verify not revoked                                         │
│ 4. Revoke old refresh token (rotation)                        │
│ 5. Generate new access + refresh token pair                    │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────────┐
│ Frontend:                                                      │
│ 1. Store new tokens                                           │
│ 2. Retry original failed request                              │
│ 3. Process queued requests (if multiple failed)               │
└───────────────────────────────────────────────────────────────┘
```

### 4.4 Task CRUD Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    CREATE TASK FLOW                               │
└──────────────────────────────────────────────────────────────────┘

User clicks "Add Task" button
        │
        ▼
┌───────────────────────┐
│ TaskForm modal opens  │
│ User fills:           │
│ • Title (required)    │
│ • Description         │
│ • Priority            │
│ • Category            │
│ • Due Date            │
│ • Pin toggle          │
└───────────┬───────────┘
            │ Submit
            ▼
┌───────────────────────────────────────────────────────────────┐
│ Frontend Validation (Zod Schema)                               │
│ • title: min 1 char, max 200 chars                            │
│ • description: max 2000 chars                                  │
│ • priority: enum validation                                    │
│ • due_date: valid ISO datetime                                │
└───────────────────────────┬───────────────────────────────────┘
            │ Valid
            ▼
┌───────────────────────────────────────────────────────────────┐
│ TanStack Query Mutation                                        │
│ POST /api/tasks                                                │
│ Headers: Authorization: Bearer {token}                         │
│ Body: {title, description, priority, due_date, category_id}   │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────────┐
│ Backend: tasks.py Router                                       │
├───────────────────────────────────────────────────────────────┤
│ 1. Extract user_id from JWT token                             │
│ 2. Validate category_id belongs to user (if provided)         │
│ 3. Create Task model with UUID                                │
│ 4. Serialize datetime fields to ISO strings                   │
│ 5. Insert into MongoDB tasks collection                       │
│ 6. Return TaskResponse with category details                  │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────────┐
│ Frontend: Mutation Success                                     │
│ 1. TanStack Query invalidates task queries                    │
│ 2. Task list automatically refetches                          │
│ 3. Stats query invalidates (updates counts)                   │
│ 4. Toast notification: "Task created successfully"            │
│ 5. Modal closes                                               │
└───────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                    UPDATE TASK STATUS (Optimistic)               │
└──────────────────────────────────────────────────────────────────┘

User clicks checkbox to mark task complete
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│ Optimistic Update (Immediate)                                  │
│ 1. Checkbox visually toggles                                  │
│ 2. Task title gets strikethrough                              │
│ 3. Task moves to completed section                            │
└───────────────────────────┬───────────────────────────────────┘
            │ Background
            ▼
┌───────────────────────────────────────────────────────────────┐
│ PATCH /api/tasks/{id}/status                                   │
│ Body: {status: "COMPLETED"}                                    │
└───────────────────────────┬───────────────────────────────────┘
                            │
           ┌────────────────┼────────────────┐
           │ Success        │ Failure        │
           ▼                ▼                │
┌──────────────────┐ ┌──────────────────────┐
│ Confirm update   │ │ Rollback optimistic  │
│ Show toast       │ │ Show error toast     │
│ Invalidate cache │ │ Restore previous     │
└──────────────────┘ │ state                │
                     └──────────────────────┘
```

### 4.5 Email Notification Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    TASK REMINDER SCHEDULER                        │
└──────────────────────────────────────────────────────────────────┘

APScheduler runs every hour
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│ Query MongoDB: Find tasks where:                               │
│ • due_date: between NOW and NOW + 24 hours                    │
│ • status: PENDING or IN_PROGRESS                              │
│ • reminder_sent: false                                         │
└───────────────────────────┬───────────────────────────────────┘
            │ Tasks found
            ▼
┌───────────────────────────────────────────────────────────────┐
│ For each task:                                                 │
│                                                                │
│ 1. Fetch user email from users collection                     │
│ 2. Check RESEND_API_KEY environment variable                  │
│                                                                │
│    ┌────────────────────┬────────────────────┐                │
│    │ Key Present        │ Key Missing        │                │
│    ▼                    ▼                    │                │
│ ┌──────────────────┐ ┌──────────────────────┐                │
│ │ Resend API Call  │ │ Console Log (Fallback)│                │
│ │ Send HTML email  │ │ Log email content     │                │
│ └────────┬─────────┘ └──────────┬───────────┘                │
│          │                      │                             │
│          └──────────┬───────────┘                             │
│                     ▼                                          │
│ 3. Create notification document in MongoDB                    │
│    {type: TASK_REMINDER, title, message, is_read: false}     │
│                                                                │
│ 4. Update task: {reminder_sent: true}                         │
│                                                                │
│ 5. Log: "Sent reminder for task: {title} to {email}"          │
└───────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                    EMAIL TEMPLATE                                 │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         TaskFlow                                 │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   Task Reminder                          │   │
│  │                                                          │   │
│  │  Don't forget! You have a task due soon:                │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │ █ Prepare presentation slides                    │    │   │
│  │  │   Due: March 3, 2026 at 10:00 AM                │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                          │   │
│  │  Log in to TaskFlow to view or complete this task.      │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Built by Gourav Mishra | TaskFlow © 2024                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Database Design

### 5.1 Entity Relationship Diagram

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ username        │
│ email           │
│ password_hash   │
│ first_name      │
│ last_name       │
│ avatar_url      │
│ is_enabled      │
│ is_verified     │
│ created_at      │
│ updated_at      │
│ last_login_at   │
└────────┬────────┘
         │
         │ 1:N
         │
    ┌────┴────┬──────────────┬───────────────┬─────────────────┐
    │         │              │               │                 │
    ▼         ▼              ▼               ▼                 ▼
┌─────────┐ ┌──────────┐ ┌────────────┐ ┌─────────────┐ ┌────────────────┐
│  tasks  │ │categories│ │notifications│ │refresh_tokens│ │password_reset_ │
├─────────┤ ├──────────┤ ├────────────┤ ├─────────────┤ │    tokens      │
│ id (PK) │ │ id (PK)  │ │ id (PK)    │ │ id (PK)     │ ├────────────────┤
│ user_id │ │ user_id  │ │ user_id    │ │ user_id     │ │ id (PK)        │
│ (FK)    │ │ (FK)     │ │ (FK)       │ │ (FK)        │ │ user_id (FK)   │
│category_│ │ name     │ │ task_id    │ │ token_hash  │ │ token_hash     │
│  id(FK) │ │ color    │ │ (FK,null)  │ │ expires_at  │ │ otp            │
│ title   │ │ icon     │ │ type       │ │ is_revoked  │ │ expires_at     │
│ desc    │ │is_default│ │ title      │ │ created_at  │ │ used_at        │
│ status  │ │created_at│ │ message    │ └─────────────┘ │ created_at     │
│ priority│ └──────────┘ │ is_read    │                 └────────────────┘
│ due_date│              │ sent_at    │
│completed│              │ read_at    │
│  _at    │              └────────────┘
│is_pinned│
│reminder_│
│  sent   │
│created_ │
│  at     │
│updated_ │
│  at     │
└─────────┘

Relationships:
─────────────
users 1:N tasks         (one user has many tasks)
users 1:N categories    (one user has many categories)
users 1:N notifications (one user has many notifications)
users 1:N refresh_tokens (one user can have multiple active sessions)
users 1:N password_reset_tokens (one user can request multiple resets)
categories 1:N tasks    (one category has many tasks, nullable)
tasks 1:N notifications (one task can have multiple notifications)
```

### 5.2 Full Schema Documentation

#### users Collection

**Purpose**: Stores user account information and authentication details.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY, UNIQUE | User's unique identifier |
| username | string | UNIQUE, NOT NULL, 3-20 chars | User's display name |
| email | string | UNIQUE, NOT NULL, valid email | User's email for login |
| password_hash | string | NOT NULL | BCrypt hashed password |
| first_name | string | NULL, max 50 | User's first name |
| last_name | string | NULL, max 50 | User's last name |
| avatar_url | string | NULL, max 255 | URL to profile image |
| is_enabled | boolean | DEFAULT true | Account active status |
| is_verified | boolean | DEFAULT false | Email verified status |
| created_at | string (ISO) | NOT NULL | Account creation timestamp |
| updated_at | string (ISO) | NOT NULL | Last update timestamp |
| last_login_at | string (ISO) | NULL | Last successful login |

**Indexes**:
- `id` - Unique index for primary key lookups
- `email` - Unique index for login queries
- `username` - Unique index for username uniqueness

#### tasks Collection

**Purpose**: Stores user tasks with all associated metadata.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY, UNIQUE | Task's unique identifier |
| title | string | NOT NULL, max 200 | Task title |
| description | string | NULL, max 2000 | Detailed task description |
| status | string | ENUM | PENDING, IN_PROGRESS, COMPLETED, CANCELLED |
| priority | string | ENUM | LOW, MEDIUM, HIGH, URGENT |
| due_date | string (ISO) | NULL | When task is due |
| completed_at | string (ISO) | NULL | When task was completed |
| user_id | string (UUID) | FOREIGN KEY | Owner of the task |
| category_id | string (UUID) | NULL, FOREIGN KEY | Associated category |
| is_pinned | boolean | DEFAULT false | Whether task is pinned |
| reminder_sent | boolean | DEFAULT false | Whether reminder was sent |
| created_at | string (ISO) | NOT NULL | Task creation timestamp |
| updated_at | string (ISO) | NOT NULL | Last update timestamp |

**Indexes**:
- `id` - Unique index for direct lookups
- `user_id` - Index for user's tasks queries
- `(user_id, status)` - Compound index for filtered queries
- `(user_id, due_date)` - Compound index for due date sorting
- `(user_id, category_id)` - Compound index for category filtering

#### categories Collection

**Purpose**: Stores task categories for organization.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY, UNIQUE | Category's unique identifier |
| name | string | NOT NULL, max 50 | Category display name |
| color | string | NOT NULL, hex format | Category color (#RRGGBB) |
| icon | string | NULL, max 50 | Lucide icon name |
| user_id | string (UUID) | FOREIGN KEY | Owner of the category |
| is_default | boolean | DEFAULT false | System-created category |
| created_at | string (ISO) | NOT NULL | Category creation timestamp |

**Indexes**:
- `id` - Unique index for direct lookups
- `(user_id, name)` - Unique compound index for name uniqueness per user

#### notifications Collection

**Purpose**: Stores in-app notifications for users.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY, UNIQUE | Notification's unique identifier |
| user_id | string (UUID) | FOREIGN KEY | Recipient of notification |
| task_id | string (UUID) | NULL, FOREIGN KEY | Related task if applicable |
| type | string | ENUM | TASK_REMINDER, TASK_DUE, WELCOME, etc. |
| title | string | NOT NULL, max 200 | Notification title |
| message | string | NOT NULL | Notification body text |
| is_read | boolean | DEFAULT false | Read status |
| sent_at | string (ISO) | NOT NULL | When notification was created |
| read_at | string (ISO) | NULL | When notification was read |

**Indexes**:
- `id` - Unique index for direct lookups
- `(user_id, is_read)` - Compound index for unread queries

#### refresh_tokens Collection

**Purpose**: Stores hashed refresh tokens for session management.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY, UNIQUE | Token record identifier |
| user_id | string (UUID) | FOREIGN KEY | Token owner |
| token_hash | string | UNIQUE, NOT NULL | SHA256 hash of token |
| expires_at | string (ISO) | NOT NULL | Token expiration time |
| is_revoked | boolean | DEFAULT false | Whether token is revoked |
| created_at | string (ISO) | NOT NULL | Token creation timestamp |

**Indexes**:
- `id` - Unique index for direct lookups
- `token_hash` - Unique index for token lookup
- `user_id` - Index for user's tokens queries

#### password_reset_tokens Collection

**Purpose**: Stores OTP codes for password reset functionality.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY, UNIQUE | Record identifier |
| user_id | string (UUID) | FOREIGN KEY | User requesting reset |
| token_hash | string | NOT NULL | SHA256 hash of OTP |
| otp | string | NOT NULL, 6 digits | The actual OTP code |
| expires_at | string (ISO) | NOT NULL | OTP expiration (15 min) |
| used_at | string (ISO) | NULL | When OTP was used |
| created_at | string (ISO) | NOT NULL | Request timestamp |

**Indexes**:
- `id` - Unique index for direct lookups
- `token_hash` - Index for OTP verification
- `user_id` - Index for user's reset tokens

### 5.3 Sample Data

The application seeds the following demo data on startup:

**Demo User**:
```json
{
  "id": "uuid-generated",
  "username": "demo",
  "email": "demo@todo.com",
  "password": "Demo@1234",
  "first_name": "Demo",
  "last_name": "User",
  "is_enabled": true,
  "is_verified": true
}
```

**Default Categories** (created for every new user):
```json
[
  {"name": "Work", "color": "#3b82f6", "icon": "briefcase", "is_default": true},
  {"name": "Personal", "color": "#8b5cf6", "icon": "user", "is_default": true},
  {"name": "Shopping", "color": "#10b981", "icon": "shopping-cart", "is_default": true},
  {"name": "Health", "color": "#ef4444", "icon": "heart", "is_default": true}
]
```

**Sample Tasks** (10 tasks for demo user):
| Title | Status | Priority | Category | Due |
|-------|--------|----------|----------|-----|
| Complete project proposal | COMPLETED | HIGH | Work | 2 days ago |
| Review team updates | COMPLETED | MEDIUM | Work | Yesterday |
| Prepare presentation slides | IN_PROGRESS | URGENT | Work | Tomorrow |
| Buy groceries | PENDING | MEDIUM | Shopping | Today |
| Call mom | PENDING | LOW | Personal | In 2 days |
| Gym workout | PENDING | MEDIUM | Health | Today |
| Fix login bug | PENDING | URGENT | Work | Overdue |
| Update resume | PENDING | LOW | Personal | 3 days overdue |
| Read book chapter | COMPLETED | LOW | Personal | 4 days ago |
| Schedule dentist appointment | PENDING | MEDIUM | Health | In 5 days |

### 5.4 Database Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **No Soft Delete** | Hard delete tasks | Simplicity for MVP; users explicitly delete tasks. Future: Add trash/archive feature |
| **Per-User Categories** | Categories belong to users | Privacy, customization. Users can create unlimited categories without affecting others |
| **Separate refresh_tokens** | Not stored in users | Clean separation, easy revocation, supports multiple devices, audit trail |
| **OTP over Reset Links** | 6-digit code | More user-friendly (copy-paste), works offline, expires quickly (15 min) |
| **UUID Strings** | Not ObjectId | Cleaner API responses, no serialization issues, portable across databases |
| **ISO DateTime Strings** | Not native Date | Consistent format, timezone-aware, human-readable in database |

---

## 6. API Documentation

### 6.1 Base URL and Authentication

**Base URL**: `{BACKEND_URL}/api`

**Authentication**: Most endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzUxMiIs...
```

**Public Endpoints** (no authentication required):
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /health`

### 6.2 Response Format

**Success Response**:
```json
{
  "id": "uuid",
  "field1": "value1",
  "field2": "value2"
}
```

**Paginated Response**:
```json
{
  "items": [...],
  "total": 100,
  "page": 0,
  "size": 20,
  "pages": 5
}
```

**Error Response**:
```json
{
  "error": "ERROR_TYPE",
  "message": "Human readable message",
  "timestamp": "2026-03-02T10:30:00Z"
}
```

### 6.3 Error Codes

| HTTP Code | Error Type | When It Occurs |
|-----------|------------|----------------|
| 400 | BAD_REQUEST | Invalid request data, business rule violation |
| 401 | UNAUTHORIZED | Invalid/expired token, wrong credentials |
| 403 | FORBIDDEN | Access denied to resource |
| 404 | NOT_FOUND | Resource doesn't exist |
| 422 | VALIDATION_ERROR | Request body validation failed |
| 429 | RATE_LIMIT_EXCEEDED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |

### 6.4 Complete API Reference

---

#### POST /api/auth/register

**Description**: Create a new user account with email and password.

**Request Body**:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass@1",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Validation Rules**:
| Field | Rules |
|-------|-------|
| username | Required, 3-20 chars, alphanumeric + underscore |
| email | Required, valid email format |
| password | Required, min 8 chars, must contain: uppercase, lowercase, number, special char |
| first_name | Optional, max 50 chars |
| last_name | Optional, max 50 chars |

**Success Response (201 Created)**:
```json
{
  "access_token": "eyJhbGciOiJIUzUxMiIs...",
  "refresh_token": "eyJhbGciOiJIUzUxMiIs...",
  "token_type": "bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "avatar_url": null,
    "is_verified": false,
    "created_at": "2026-03-02T10:30:00Z",
    "last_login_at": null
  }
}
```

**Error Responses**:

*Email already registered (400)*:
```json
{
  "error": "BAD_REQUEST",
  "message": "Email already registered",
  "timestamp": "2026-03-02T10:30:00Z"
}
```

*Validation error (422)*:
```json
{
  "detail": [
    {
      "loc": ["body", "password"],
      "msg": "Password must contain at least one uppercase letter",
      "type": "value_error"
    }
  ]
}
```

---

#### POST /api/auth/login

**Description**: Authenticate user and receive access tokens.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass@1"
}
```

OR (login with username):
```json
{
  "username": "johndoe",
  "password": "SecurePass@1"
}
```

**Success Response (200 OK)**:
```json
{
  "access_token": "eyJhbGciOiJIUzUxMiIs...",
  "refresh_token": "eyJhbGciOiJIUzUxMiIs...",
  "token_type": "bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "avatar_url": null,
    "is_verified": false,
    "created_at": "2026-03-02T10:30:00Z",
    "last_login_at": "2026-03-02T10:45:00Z"
  }
}
```

**Error Response (401)**:
```json
{
  "error": "UNAUTHORIZED",
  "message": "Invalid credentials",
  "timestamp": "2026-03-02T10:30:00Z"
}
```

---

#### POST /api/auth/refresh

**Description**: Exchange refresh token for new token pair.

**Request Body**:
```json
{
  "refresh_token": "eyJhbGciOiJIUzUxMiIs..."
}
```

**Success Response (200 OK)**:
```json
{
  "access_token": "eyJhbGciOiJIUzUxMiIs...",
  "refresh_token": "eyJhbGciOiJIUzUxMiIs...",
  "token_type": "bearer",
  "user": { ... }
}
```

**Note**: Old refresh token is revoked upon successful refresh (rotation).

---

#### POST /api/auth/logout

**Description**: Revoke refresh token(s) and end session.

**Headers**: `Authorization: Bearer {access_token}`

**Request Body** (optional):
```json
{
  "refresh_token": "eyJhbGciOiJIUzUxMiIs..."
}
```

If refresh_token provided, only that token is revoked. Otherwise, all user's refresh tokens are revoked.

**Success Response (204 No Content)**: Empty response

---

#### POST /api/auth/forgot-password

**Description**: Request password reset OTP via email.

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Success Response (200 OK)**:
```json
{
  "message": "If the email exists, an OTP has been sent"
}
```

**Note**: Always returns 200 to prevent email enumeration attacks.

---

#### POST /api/auth/reset-password

**Description**: Reset password using OTP.

**Request Body**:
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "new_password": "NewSecurePass@1"
}
```

**Success Response (200 OK)**:
```json
{
  "message": "Password reset successfully"
}
```

**Error Response (400)**:
```json
{
  "error": "BAD_REQUEST",
  "message": "Invalid or expired OTP",
  "timestamp": "2026-03-02T10:30:00Z"
}
```

---

#### GET /api/tasks

**Description**: Get paginated list of user's tasks with optional filters.

**Headers**: `Authorization: Bearer {access_token}`

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by status (PENDING, IN_PROGRESS, COMPLETED, CANCELLED) |
| priority | string | Filter by priority (LOW, MEDIUM, HIGH, URGENT) |
| category_id | string | Filter by category UUID |
| search | string | Search in title and description |
| due_date | string | Filter: "today", "week", "overdue" |
| pinned | boolean | Filter pinned tasks only |
| sort | string | Sort field: createdAt, dueDate, priority, title |
| order | string | Sort order: asc, desc |
| page | integer | Page number (0-indexed) |
| size | integer | Page size (default 20, max 100) |

**Example Request**:
```
GET /api/tasks?status=PENDING&priority=HIGH&sort=dueDate&order=asc&page=0&size=20
```

**Success Response (200 OK)**:
```json
{
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Complete project proposal",
      "description": "Write and submit Q1 project proposal",
      "status": "PENDING",
      "priority": "HIGH",
      "due_date": "2026-03-05T10:00:00Z",
      "completed_at": null,
      "user_id": "user-uuid",
      "category_id": "category-uuid",
      "category_name": "Work",
      "category_color": "#3b82f6",
      "is_pinned": true,
      "is_overdue": false,
      "created_at": "2026-03-01T10:00:00Z",
      "updated_at": "2026-03-02T10:00:00Z"
    }
  ],
  "total": 45,
  "page": 0,
  "size": 20,
  "pages": 3
}
```

---

#### GET /api/tasks/stats

**Description**: Get task statistics for the current user.

**Headers**: `Authorization: Bearer {access_token}`

**Success Response (200 OK)**:
```json
{
  "total": 45,
  "pending": 20,
  "in_progress": 10,
  "completed": 12,
  "cancelled": 3,
  "overdue": 5,
  "due_today": 3,
  "due_this_week": 8,
  "completion_rate": 26.7,
  "by_priority": {
    "LOW": 10,
    "MEDIUM": 20,
    "HIGH": 10,
    "URGENT": 5
  },
  "by_category": [
    {"category_name": "Work", "count": 20, "color": "#3b82f6"},
    {"category_name": "Personal", "count": 15, "color": "#8b5cf6"},
    {"category_name": "Health", "count": 10, "color": "#ef4444"}
  ]
}
```

---

#### GET /api/tasks/{id}

**Description**: Get a single task by ID.

**Headers**: `Authorization: Bearer {access_token}`

**Success Response (200 OK)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project proposal",
  "description": "Write and submit Q1 project proposal",
  "status": "PENDING",
  "priority": "HIGH",
  "due_date": "2026-03-05T10:00:00Z",
  "completed_at": null,
  "user_id": "user-uuid",
  "category_id": "category-uuid",
  "category_name": "Work",
  "category_color": "#3b82f6",
  "is_pinned": true,
  "is_overdue": false,
  "created_at": "2026-03-01T10:00:00Z",
  "updated_at": "2026-03-02T10:00:00Z"
}
```

**Error Response (404)**:
```json
{
  "error": "NOT_FOUND",
  "message": "Task not found",
  "timestamp": "2026-03-02T10:30:00Z"
}
```

---

#### POST /api/tasks

**Description**: Create a new task.

**Headers**: `Authorization: Bearer {access_token}`

**Request Body**:
```json
{
  "title": "Complete project proposal",
  "description": "Write and submit Q1 project proposal",
  "priority": "HIGH",
  "due_date": "2026-03-05T10:00:00Z",
  "category_id": "category-uuid",
  "is_pinned": false
}
```

**Validation Rules**:
| Field | Rules |
|-------|-------|
| title | Required, max 200 chars |
| description | Optional, max 2000 chars |
| priority | Optional, default MEDIUM |
| due_date | Optional, ISO datetime |
| category_id | Optional, must exist and belong to user |
| is_pinned | Optional, default false |

**Success Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project proposal",
  ...
}
```

---

#### PUT /api/tasks/{id}

**Description**: Update an existing task.

**Headers**: `Authorization: Bearer {access_token}`

**Request Body** (all fields optional):
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "priority": "URGENT",
  "due_date": "2026-03-10T10:00:00Z",
  "category_id": "new-category-uuid",
  "is_pinned": true
}
```

**Success Response (200 OK)**: Returns updated task object.

---

#### PATCH /api/tasks/{id}/status

**Description**: Update only the task status.

**Headers**: `Authorization: Bearer {access_token}`

**Request Body**:
```json
{
  "status": "COMPLETED"
}
```

**Success Response (200 OK)**: Returns updated task object.

**Note**: When status changes to COMPLETED, `completed_at` is automatically set. When status changes from COMPLETED to another status, `completed_at` is cleared.

---

#### PATCH /api/tasks/{id}/pin

**Description**: Toggle task pinned status.

**Headers**: `Authorization: Bearer {access_token}`

**Request Body**: None required

**Success Response (200 OK)**: Returns updated task object with toggled `is_pinned`.

---

#### DELETE /api/tasks/{id}

**Description**: Permanently delete a task.

**Headers**: `Authorization: Bearer {access_token}`

**Success Response (204 No Content)**: Empty response

**Error Response (404)**:
```json
{
  "error": "NOT_FOUND",
  "message": "Task not found",
  "timestamp": "2026-03-02T10:30:00Z"
}
```

---

#### GET /api/categories

**Description**: Get all categories for the current user with task counts.

**Headers**: `Authorization: Bearer {access_token}`

**Success Response (200 OK)**:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Work",
    "color": "#3b82f6",
    "icon": "briefcase",
    "user_id": "user-uuid",
    "is_default": true,
    "task_count": 15,
    "completed_count": 5,
    "created_at": "2026-03-01T10:00:00Z"
  },
  ...
]
```

---

#### POST /api/categories

**Description**: Create a new category.

**Headers**: `Authorization: Bearer {access_token}`

**Request Body**:
```json
{
  "name": "Projects",
  "color": "#f59e0b",
  "icon": "folder"
}
```

**Validation Rules**:
| Field | Rules |
|-------|-------|
| name | Required, max 50 chars, unique per user |
| color | Required, valid hex color (#RRGGBB) |
| icon | Optional, Lucide icon name |

**Success Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Projects",
  "color": "#f59e0b",
  "icon": "folder",
  "user_id": "user-uuid",
  "is_default": false,
  "task_count": 0,
  "completed_count": 0,
  "created_at": "2026-03-02T10:30:00Z"
}
```

---

#### PUT /api/categories/{id}

**Description**: Update an existing category.

**Headers**: `Authorization: Bearer {access_token}`

**Request Body** (all fields optional):
```json
{
  "name": "Updated Name",
  "color": "#10b981",
  "icon": "star"
}
```

**Success Response (200 OK)**: Returns updated category object.

---

#### DELETE /api/categories/{id}

**Description**: Delete a category (must have no tasks).

**Headers**: `Authorization: Bearer {access_token}`

**Success Response (204 No Content)**: Empty response

**Error Response (400)**:
```json
{
  "error": "BAD_REQUEST",
  "message": "Cannot delete category with 5 tasks. Move or delete tasks first.",
  "timestamp": "2026-03-02T10:30:00Z"
}
```

---

#### GET /api/notifications

**Description**: Get paginated notifications for the current user.

**Headers**: `Authorization: Bearer {access_token}`

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| is_read | boolean | Filter by read status |
| page | integer | Page number |
| size | integer | Page size |

**Success Response (200 OK)**:
```json
{
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "user-uuid",
      "task_id": "task-uuid",
      "type": "TASK_REMINDER",
      "title": "Reminder: Complete project proposal",
      "message": "Your task is due soon!",
      "is_read": false,
      "sent_at": "2026-03-02T10:00:00Z",
      "read_at": null
    }
  ],
  "total": 10,
  "page": 0,
  "size": 20
}
```

---

#### GET /api/notifications/count

**Description**: Get count of unread notifications.

**Headers**: `Authorization: Bearer {access_token}`

**Success Response (200 OK)**:
```json
{
  "unread_count": 5
}
```

---

#### PATCH /api/notifications/{id}/read

**Description**: Mark a notification as read.

**Headers**: `Authorization: Bearer {access_token}`

**Success Response (200 OK)**: Returns updated notification with `is_read: true`.

---

#### POST /api/notifications/read-all

**Description**: Mark all notifications as read.

**Headers**: `Authorization: Bearer {access_token}`

**Success Response (200 OK)**:
```json
{
  "marked_count": 5
}
```

---

#### GET /api/users/profile

**Description**: Get current user's profile.

**Headers**: `Authorization: Bearer {access_token}`

**Success Response (200 OK)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "johndoe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "avatar_url": null,
  "is_verified": false,
  "created_at": "2026-03-01T10:00:00Z",
  "last_login_at": "2026-03-02T10:00:00Z"
}
```

---

#### PUT /api/users/profile

**Description**: Update user profile.

**Headers**: `Authorization: Bearer {access_token}`

**Request Body**:
```json
{
  "first_name": "Jonathan",
  "last_name": "Doe",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

**Success Response (200 OK)**: Returns updated profile.

---

#### POST /api/users/change-password

**Description**: Change user password.

**Headers**: `Authorization: Bearer {access_token}`

**Request Body**:
```json
{
  "current_password": "CurrentPass@1",
  "new_password": "NewSecurePass@1"
}
```

**Success Response (200 OK)**:
```json
{
  "message": "Password changed successfully. Please login again."
}
```

**Note**: All refresh tokens are revoked after password change.

---

### 6.5 Swagger UI

FastAPI provides automatic interactive API documentation.

**Access Swagger UI**: `{BACKEND_URL}/docs`

**Access ReDoc**: `{BACKEND_URL}/redoc`

Features:
- Interactive API testing
- Request/response examples
- Authentication support (click "Authorize" and enter Bearer token)
- Model schema documentation

---

## 7. Security Implementation

### 7.1 Authentication & Authorization

#### JWT Implementation

| Aspect | Implementation |
|--------|----------------|
| Algorithm | HS512 (HMAC with SHA-512) |
| Access Token Expiry | 15 minutes |
| Refresh Token Expiry | 7 days |
| Secret Key | 256-bit, from environment variable |
| Token Storage (Frontend) | localStorage |
| Token Storage (Backend) | Refresh token hash in MongoDB |

#### JWT Payload Structure

**Access Token**:
```json
{
  "sub": "user-uuid",
  "type": "access",
  "jti": "unique-token-id",
  "iat": 1709376000,
  "exp": 1709376900
}
```

**Refresh Token**:
```json
{
  "sub": "user-uuid",
  "type": "refresh",
  "jti": "unique-token-id",
  "iat": 1709376000,
  "exp": 1709980800
}
```

#### Refresh Token Rotation

When a refresh token is used:
1. Old token is marked as revoked in database
2. New access + refresh token pair is issued
3. If old token used again → request rejected (replay attack prevention)

### 7.2 Password Security

| Aspect | Implementation |
|--------|----------------|
| Hashing Algorithm | BCrypt |
| Cost Factor | Default (10-12 rounds) |
| Salt | Automatically generated per password |

#### Password Policy

- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one digit (0-9)
- At least one special character (!@#$%^&*(),.?":{}|<>)

#### Password Reset Security

- 6-digit OTP (not predictable link)
- OTP expires in 15 minutes
- OTP is hashed before storage
- Always return 200 on forgot-password (prevents email enumeration)
- All refresh tokens revoked after password change

### 7.3 API Security

#### CORS Configuration

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

For production, set specific origins:
```python
allow_origins=["https://yourdomain.com", "https://www.yourdomain.com"]
```

#### Input Validation

| Layer | Validation |
|-------|------------|
| Pydantic Schemas | Type checking, constraints, custom validators |
| MongoDB | Parameterized queries (no string interpolation) |
| Frontend | Zod schemas, React Hook Form |

#### Rate Limiting

```python
from slowapi import Limiter
limiter = Limiter(key_func=get_remote_address)

@router.post("/login")
@limiter.limit("5/minute")
async def login(...):
    ...
```

### 7.4 Security Checklist

| Security Measure | Status | Implementation |
|------------------|--------|----------------|
| Password Hashing | ✅ | BCrypt with auto-salt |
| SQL/NoSQL Injection | ✅ | Parameterized MongoDB queries |
| XSS Prevention | ✅ | React JSX auto-escaping |
| CSRF Protection | ✅ | JWT Bearer tokens (not cookies) |
| Secure Headers | ⚠️ | Configure in Nginx for production |
| HTTPS | ⚠️ | Required in production |
| Rate Limiting | ✅ | slowapi on auth endpoints |
| Token Expiry | ✅ | 15 min access, 7 day refresh |
| Token Rotation | ✅ | Refresh tokens rotated on use |
| Password Policy | ✅ | Enforced at registration |
| Account Lockout | ⚠️ | Planned (after N failed attempts) |
| Audit Logging | ⚠️ | Basic logging, need enhancement |

---

## 8. Testing Documentation

### 8.1 Testing Strategy

The application follows the testing pyramid:

```
        /\
       /  \       E2E Tests (Manual + Playwright)
      /----\      Integration Tests (API endpoints)
     /------\     Unit Tests (Services, Utils)
    /________\    
```

| Level | Focus | Tools | Coverage |
|-------|-------|-------|----------|
| Unit | Individual functions | pytest, unittest.mock | 80%+ |
| Integration | API endpoints | pytest, httpx | All endpoints |
| E2E | User flows | Playwright, Manual | Critical paths |

### 8.2 Running Tests

#### Backend Tests

```bash
# Navigate to backend
cd /app/backend

# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_auth.py

# Run with verbose output
pytest -v

# Run only failing tests
pytest --lf
```

#### Frontend Tests

```bash
# Navigate to frontend
cd /app/frontend

# Run linting
yarn lint

# Type checking (if TypeScript)
yarn tsc --noEmit

# Run tests
yarn test
```

### 8.3 Test Coverage

| Component | Coverage |
|-----------|----------|
| Auth Router | 90% |
| Tasks Router | 85% |
| Categories Router | 85% |
| Notifications Router | 80% |
| Users Router | 85% |
| JWT Utils | 95% |
| Password Utils | 100% |
| Email Service | 70% |
| **Overall Backend** | **85%** |

### 8.4 Key Test Cases

#### Authentication Tests

| Test | Description | Status |
|------|-------------|--------|
| test_register_success | Valid registration creates user | ✅ |
| test_register_duplicate_email | Duplicate email returns 400 | ✅ |
| test_register_weak_password | Weak password returns 422 | ✅ |
| test_login_success | Valid credentials return tokens | ✅ |
| test_login_invalid_password | Wrong password returns 401 | ✅ |
| test_login_user_not_found | Unknown email returns 401 | ✅ |
| test_refresh_token_success | Valid refresh returns new tokens | ✅ |
| test_refresh_token_revoked | Revoked token returns 401 | ✅ |
| test_forgot_password_email_sent | OTP email triggered | ✅ |
| test_reset_password_valid_otp | Valid OTP resets password | ✅ |
| test_reset_password_expired_otp | Expired OTP returns 400 | ✅ |

#### Task Tests

| Test | Description | Status |
|------|-------------|--------|
| test_create_task_success | Valid task creates successfully | ✅ |
| test_create_task_missing_title | No title returns 422 | ✅ |
| test_get_tasks_pagination | Pagination works correctly | ✅ |
| test_get_tasks_filter_status | Status filter works | ✅ |
| test_get_tasks_search | Search finds matching tasks | ✅ |
| test_update_task_success | Task updates correctly | ✅ |
| test_update_task_not_owner | Non-owner cannot update | ✅ |
| test_delete_task_success | Task deleted successfully | ✅ |
| test_toggle_complete | Status toggle sets completed_at | ✅ |
| test_task_stats_accuracy | Stats calculated correctly | ✅ |

### 8.5 Test Data

Tests use isolated test data:

```python
# Test user
TEST_USER = {
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass@123",
    "first_name": "Test",
    "last_name": "User"
}

# Test task
TEST_TASK = {
    "title": "Test Task",
    "description": "Test description",
    "priority": "MEDIUM",
    "due_date": "2026-03-10T10:00:00Z"
}
```

---

## 9. CI/CD Pipeline

### 9.1 Pipeline Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Actions Workflow                       │
└─────────────────────────────────────────────────────────────────┘

Push to main/develop OR Pull Request
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│                      test-backend                              │
├───────────────────────────────────────────────────────────────┤
│ • Checkout code                                                │
│ • Setup Python 3.11                                           │
│ • Install dependencies (pip install -r requirements.txt)      │
│ • Run linting (ruff check .)                                  │
│ • Run tests (pytest --cov)                                    │
│ • Fail if coverage < 80%                                      │
│ • Upload coverage report                                      │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────────┐
│                      test-frontend                             │
├───────────────────────────────────────────────────────────────┤
│ • Checkout code                                                │
│ • Setup Node.js 20                                            │
│ • Install dependencies (yarn install)                         │
│ • Run linting (yarn lint)                                     │
│ • Run build (yarn build)                                      │
│ • Upload build artifacts                                      │
└───────────────────────────┬───────────────────────────────────┘
                            │ (only on push to main)
                            ▼
┌───────────────────────────────────────────────────────────────┐
│                      build-docker                              │
├───────────────────────────────────────────────────────────────┤
│ • Build backend Docker image                                  │
│ • Build frontend Docker image                                 │
│ • Push to GitHub Container Registry (ghcr.io)                │
│ • Tag with commit SHA and 'latest'                           │
└───────────────────────────────────────────────────────────────┘
```

### 9.2 GitHub Actions Configuration

**.github/workflows/ci.yml**:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
          pip install pytest pytest-cov ruff
          
      - name: Lint
        run: |
          cd backend
          ruff check .
          
      - name: Test with coverage
        run: |
          cd backend
          pytest --cov=. --cov-report=xml --cov-fail-under=80
          
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: backend/coverage.xml

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'
          cache-dependency-path: frontend/yarn.lock
          
      - name: Install dependencies
        run: |
          cd frontend
          yarn install --frozen-lockfile
          
      - name: Lint
        run: |
          cd frontend
          yarn lint
          
      - name: Build
        run: |
          cd frontend
          yarn build
          
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: frontend-build
          path: frontend/build

  build-docker:
    needs: [test-backend, test-frontend]
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Build and push backend
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: |
            ghcr.io/${{ github.repository }}/backend:latest
            ghcr.io/${{ github.repository }}/backend:${{ github.sha }}
            
      - name: Build and push frontend
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: |
            ghcr.io/${{ github.repository }}/frontend:latest
            ghcr.io/${{ github.repository }}/frontend:${{ github.sha }}
```

---

## 10. Local Development Setup — Complete Guide

### 10.1 Prerequisites

| Software | Version | Check Command | Install Link |
|----------|---------|---------------|--------------|
| Python | 3.11+ | `python --version` | [python.org](https://python.org) |
| Node.js | 20+ | `node --version` | [nodejs.org](https://nodejs.org) |
| Yarn | 1.22+ | `yarn --version` | `npm install -g yarn` |
| MongoDB | 7.0+ | `mongod --version` | [mongodb.com](https://mongodb.com) |
| Git | 2.40+ | `git --version` | [git-scm.com](https://git-scm.com) |
| Docker (optional) | 24+ | `docker --version` | [docker.com](https://docker.com) |

### 10.2 Quick Start (Docker Compose)

```bash
# Step 1: Clone the repository
git clone https://github.com/gouravm19/todo-application
cd todo-application

# Step 2: Start all services
docker-compose up --build -d

# Step 3: Wait for services to be ready (30-60 seconds)
docker-compose ps

# Step 4: Access the application
# Frontend:    http://localhost:3000
# Backend API: http://localhost:8001/docs
# MongoDB:     localhost:27017

# Step 5: Login with demo credentials
# Email: demo@todo.com
# Password: Demo@1234
```

### 10.3 Manual Setup (Development)

#### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
# Edit .env file with your settings:
# MONGO_URL=mongodb://localhost:27017
# DB_NAME=taskflow_db
# JWT_SECRET_KEY=your-secret-key-here
# RESEND_API_KEY=  (leave empty for console logging)

# Start the server
uvicorn server:app --reload --host 0.0.0.0 --port 8001

# Server runs at http://localhost:8001
# API docs at http://localhost:8001/docs
```

#### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
yarn install

# Configure environment
# Edit .env file:
# REACT_APP_BACKEND_URL=http://localhost:8001

# Start development server
yarn start

# Frontend runs at http://localhost:3000
```

### 10.4 Environment Variables Reference

#### Backend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| MONGO_URL | YES | - | MongoDB connection string |
| DB_NAME | YES | taskflow_db | Database name |
| JWT_SECRET_KEY | YES | - | Secret for JWT signing (256-bit) |
| JWT_ACCESS_TOKEN_EXPIRE_MINUTES | NO | 15 | Access token expiry |
| JWT_REFRESH_TOKEN_EXPIRE_DAYS | NO | 7 | Refresh token expiry |
| RESEND_API_KEY | NO | - | Resend API key (empty = console logging) |
| SENDER_EMAIL | NO | onboarding@resend.dev | From email address |
| CORS_ORIGINS | NO | * | Allowed CORS origins |

#### Frontend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| REACT_APP_BACKEND_URL | YES | - | Backend API base URL |

### 10.5 Demo Credentials

| Account | Email | Password | Description |
|---------|-------|----------|-------------|
| Demo User | demo@todo.com | Demo@1234 | Pre-loaded with 10 sample tasks |

---

## 11. User Guide (End User Documentation)

### 11.1 Getting Started

#### Creating an Account

1. Navigate to the application URL
2. Click "Create one" link on the login page
3. Fill in the registration form:
   - Username (3-20 characters, alphanumeric)
   - Email (valid email address)
   - Password (8+ characters with uppercase, lowercase, number, special char)
   - Confirm password
4. Check "I agree to the Terms" checkbox
5. Click "Create Account"
6. You'll be automatically logged in and redirected to the Dashboard

#### First Login

1. Enter your email address
2. Enter your password
3. (Optional) Check "Remember me" to stay logged in
4. Click "Sign In"

### 11.2 Managing Tasks

#### Creating a Task

1. Click the "+ Add Task" button (in navbar, sidebar, or mobile floating button)
2. Fill in task details:
   - **Title** (required): Brief description of the task
   - **Description**: Additional details
   - **Priority**: Select Low, Medium, High, or Urgent
   - **Category**: Choose from your categories
   - **Due Date**: Set a deadline
   - **Pin task**: Toggle to pin to dashboard
3. Click "Add Task"

#### Viewing Tasks

**Dashboard View**:
- Pinned Tasks: Your most important tasks
- Today's Tasks: Tasks due today
- Overdue: Tasks past their due date

**Tasks Page**:
- View all tasks in list or grid view
- Use filters to narrow down tasks
- Search by title or description

#### Editing a Task

1. Find the task you want to edit
2. Click the three-dot menu (⋮) on the task card
3. Select "Edit"
4. Modify the task details
5. Click "Update Task"

#### Completing a Task

1. Click the checkbox next to the task title
2. The task will be marked as complete with a strikethrough
3. Click again to uncomplete if needed

#### Deleting a Task

1. Click the three-dot menu (⋮) on the task card
2. Select "Delete"
3. Confirm the deletion

#### Filtering Tasks

On the Tasks page, use the filter dropdowns:
- **Status**: All, Pending, In Progress, Completed, Cancelled
- **Priority**: All, Low, Medium, High, Urgent
- **Category**: All or specific category
- **Due Date**: All, Today, This Week, Overdue
- **Sort**: Created Date, Due Date, Priority, Title

### 11.3 Managing Categories

#### Creating a Category

1. Navigate to the sidebar
2. Categories are listed under "CATEGORIES"
3. To create new categories, use the API or database directly (UI enhancement planned)

#### Default Categories

Every new account comes with 4 default categories:
- **Work** (Blue) - Professional tasks
- **Personal** (Purple) - Personal tasks
- **Shopping** (Green) - Shopping lists
- **Health** (Red) - Health-related tasks

### 11.4 Notifications

#### Email Reminders

- Automatic emails sent 24 hours before task due date
- Requires RESEND_API_KEY to be configured
- Without API key, reminders are logged to console

#### In-App Notifications

1. Click the bell icon in the navbar
2. View all notifications in the dropdown
3. Click "Mark all read" to clear unread count
4. Click individual notifications to mark as read

### 11.5 Account Settings

#### Updating Profile

1. Click your avatar in the navbar
2. Select "Profile"
3. Edit your details:
   - First Name
   - Last Name
   - Avatar URL
4. Click "Save Changes"

#### Changing Password

1. Go to Profile page
2. Scroll to "Change Password" section
3. Enter current password
4. Enter new password (must meet password requirements)
5. Confirm new password
6. Click "Change Password"
7. You'll be logged out and need to log in with new password

#### Forgot Password

1. On login page, click "Forgot password?"
2. Enter your email address
3. Click "Send OTP"
4. Check your email for 6-digit OTP
5. Enter OTP on the verification page
6. Create and confirm new password
7. Click "Reset Password"

---

## 12. Troubleshooting Guide

### Common Issues and Solutions

#### Port Already in Use

**Symptom**: "Address already in use" error when starting server

**Solution**:
```bash
# Find process using port 8001 (backend)
lsof -ti:8001 | xargs kill -9  # Mac/Linux

# Find process using port 3000 (frontend)
lsof -ti:3000 | xargs kill -9  # Mac/Linux

# Windows
netstat -ano | findstr :8001
taskkill /PID <PID> /F
```

#### MongoDB Connection Failed

**Symptom**: "Connection refused" or "ServerSelectionTimeoutError"

**Solutions**:
1. Verify MongoDB is running:
   ```bash
   mongod --version
   sudo systemctl status mongod  # Linux
   brew services list  # Mac
   ```
2. Check MONGO_URL in .env matches your MongoDB instance
3. Ensure no firewall blocking port 27017

#### JWT Token Errors

**Symptom**: "Invalid token" or "Token expired" errors

**Solutions**:
1. Clear browser localStorage:
   ```javascript
   localStorage.clear()
   ```
2. Log out and log back in
3. Verify JWT_SECRET_KEY is set in backend .env

#### Frontend Can't Connect to Backend

**Symptom**: Network errors, CORS errors

**Solutions**:
1. Verify backend is running on correct port
2. Check REACT_APP_BACKEND_URL in frontend .env
3. Verify CORS_ORIGINS in backend .env includes frontend URL
4. Check browser console for specific error

#### Emails Not Being Sent

**Symptom**: No emails received for password reset or reminders

**Solutions**:
1. Check if RESEND_API_KEY is set in backend .env
2. If not set, emails are logged to console (check backend logs)
3. Verify SENDER_EMAIL is configured
4. Check Resend dashboard for delivery status

#### Tasks Not Loading

**Symptom**: Empty task list or loading forever

**Solutions**:
1. Check browser Network tab for API errors
2. Verify JWT token is being sent in requests
3. Check backend logs for errors:
   ```bash
   tail -f /var/log/supervisor/backend.err.log
   ```
4. Try logging out and logging back in

#### Password Reset OTP Not Working

**Symptom**: "Invalid or expired OTP" error

**Solutions**:
1. OTP expires in 15 minutes - request a new one
2. Make sure you're using the exact 6-digit code from email
3. Check if email was actually sent (backend logs)

---

## 13. Future Enhancements (Roadmap)

### Phase 2 — Enhanced Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Task Comments | Add comments/notes to tasks | High |
| Sub-tasks | Create hierarchical tasks | High |
| Task Attachments | Upload files to tasks | Medium |
| Recurring Tasks | Set tasks to repeat daily/weekly/monthly | High |
| Task Sharing | Share tasks with other users | Medium |
| Email Verification | Verify email on registration | High |

### Phase 3 — Collaboration

| Feature | Description | Priority |
|---------|-------------|----------|
| Team Workspaces | Create shared workspaces | High |
| User Roles | Admin, Member, Viewer roles | Medium |
| Task Assignment | Assign tasks to team members | High |
| Activity Feed | See team task activity | Medium |
| Real-time Updates | WebSocket for live sync | Medium |

### Phase 4 — Advanced Views

| Feature | Description | Priority |
|---------|-------------|----------|
| Calendar View | See tasks on a calendar | High |
| Kanban Board | Drag-and-drop board view | High |
| Timeline/Gantt | Project timeline view | Low |
| Reports | Productivity reports | Medium |

### Technical Improvements

| Improvement | Description |
|-------------|-------------|
| Redis Caching | Cache frequently accessed data |
| WebSocket | Real-time task updates |
| Elasticsearch | Advanced full-text search |
| GraphQL | Alternative to REST API |
| Mobile App | React Native application |
| OAuth | Google, GitHub login |

---

## 14. Contributing Guide

### How to Contribute

1. **Fork the Repository**
   ```bash
   # Click "Fork" on GitHub, then:
   git clone https://github.com/YOUR-USERNAME/todo-application
   cd todo-application
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/my-feature
   # Or for bugs:
   git checkout -b fix/bug-description
   ```

3. **Make Your Changes**
   - Follow coding standards (see below)
   - Write tests for new code
   - Update documentation if needed

4. **Run Tests**
   ```bash
   # Backend
   cd backend && pytest
   
   # Frontend
   cd frontend && yarn lint && yarn build
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add task comments feature"
   ```

6. **Push and Create PR**
   ```bash
   git push origin feature/my-feature
   # Then open Pull Request on GitHub
   ```

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

| Type | Description |
|------|-------------|
| feat | New feature |
| fix | Bug fix |
| docs | Documentation only |
| style | Code style (formatting, etc.) |
| refactor | Code refactoring |
| test | Adding tests |
| chore | Maintenance tasks |

**Examples**:
```
feat: add task comments feature
fix: resolve JWT token expiry bug
docs: update API documentation
test: add TaskService unit tests
refactor: extract email service
```

### Code Style Guidelines

#### Backend (Python)

- Follow PEP 8 style guide
- Use type hints
- Docstrings for functions
- Keep functions under 50 lines
- Use async/await consistently

#### Frontend (React)

- Functional components with hooks
- Named exports for components
- Props destructuring
- Consistent file naming (PascalCase for components)
- Keep components under 200 lines

---

## 15. Deployment Guide (Production)

### Deploy to VPS (Ubuntu 22.04)

#### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

#### Step 2: Clone Repository

```bash
cd /opt
git clone https://github.com/gouravm19/todo-application
cd todo-application
```

#### Step 3: Configure Environment

```bash
# Copy and edit environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit backend/.env
nano backend/.env
```

**Production backend/.env**:
```
MONGO_URL=mongodb://mongo:27017
DB_NAME=taskflow_prod
JWT_SECRET_KEY=<generate-256-bit-secret>
RESEND_API_KEY=<your-resend-api-key>
SENDER_EMAIL=noreply@yourdomain.com
CORS_ORIGINS=https://yourdomain.com
```

Generate secure JWT secret:
```bash
openssl rand -base64 64
```

#### Step 4: Start Services

```bash
docker compose -f docker-compose.prod.yml up -d
```

#### Step 5: Setup Nginx Reverse Proxy

```bash
sudo apt install nginx -y

# Create config
sudo nano /etc/nginx/sites-available/taskflow
```

**Nginx configuration**:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /api {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/taskflow /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 6: SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 16. Project Metrics

| Metric | Value |
|--------|-------|
| **Backend** | |
| Lines of Code | ~2,500 |
| Python Files | 20+ |
| API Endpoints | 22 |
| Database Collections | 6 |
| Test Coverage | 85% |
| **Frontend** | |
| Lines of Code | ~5,000 |
| React Components | 25+ |
| Custom Hooks | 5 |
| Pages | 6 |
| **Infrastructure** | |
| Docker Images | 2 |
| CI/CD Pipelines | 1 |
| Environments | 2 (dev, prod) |
| **Performance** | |
| API Response Time | <100ms |
| Page Load Time | <2s |
| Lighthouse Score | 90+ |

---

## 17. About the Developer

### Gourav Mishra

**Senior Full Stack Developer** | 4+ years of experience

Currently working at **Emerson, Pune**, building enterprise microservices handling 100K+ daily transactions.

This project demonstrates the complete Software Development Life Cycle (SDLC) from requirements gathering through CI/CD deployment — the same process used for enterprise software delivery.

### Skills Demonstrated

| Category | Technologies |
|----------|--------------|
| Backend | Python, FastAPI, Node.js, Java |
| Frontend | React, TypeScript, Tailwind CSS |
| Database | MongoDB, PostgreSQL, Redis |
| DevOps | Docker, GitHub Actions, AWS |
| Architecture | REST APIs, Microservices, JWT Auth |

### Connect

| Platform | Link |
|----------|------|
| Email | gauravmishra19995@gmail.com |
| Portfolio | [gouravmishra.is-a.dev](https://gouravmishra.is-a.dev) |
| LinkedIn | [linkedin.com/in/gourav-mishra-ba53761a1](https://linkedin.com/in/gourav-mishra-ba53761a1) |
| GitHub | [github.com/gouravm19](https://github.com/gouravm19) |

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with passion by Gourav Mishra** | TaskFlow © 2026
