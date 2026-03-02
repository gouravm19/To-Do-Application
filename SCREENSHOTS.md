# TaskFlow — Application Screenshots

> **Complete Visual Documentation of the TaskFlow Application**  
> All screenshots showcase the production-ready To-Do application built with FastAPI + MongoDB + React

---

## Table of Contents

1. [Authentication Pages](#1-authentication-pages)
   - [Login Page](#11-login-page)
   - [Register Page](#12-register-page)
   - [Forgot Password Page](#13-forgot-password-page)
2. [Main Application Pages](#2-main-application-pages)
   - [Dashboard](#21-dashboard)
   - [Tasks Page](#22-tasks-page)
   - [Profile Page](#23-profile-page)
3. [Interactive Features](#3-interactive-features)
   - [Add Task Modal](#31-add-task-modal)
   - [Task Filters](#32-task-filters)
   - [Search Functionality](#33-search-functionality)
4. [Mobile Responsive Views](#4-mobile-responsive-views)
   - [Mobile Login](#41-mobile-login)
   - [Mobile Dashboard](#42-mobile-dashboard)
   - [Mobile Tasks](#43-mobile-tasks)
   - [Mobile Profile](#44-mobile-profile)

---

## 1. Authentication Pages

### 1.1 Login Page

The login page provides a clean, professional interface for user authentication.

**Features Shown:**
- TaskFlow branding with logo
- Email and password input fields with icons
- "Remember me" checkbox option
- "Forgot password?" link
- "Sign In" primary action button
- "Create one" link for new users
- Demo credentials displayed for easy testing

![Login Page](./screenshots/01_login_page.png)

**URL:** `/login`

**Key Design Elements:**
- Dark slate background (#0f172a)
- Card-based form container with subtle border
- Blue primary button (#3b82f6)
- Consistent typography using Inter font

---

### 1.2 Register Page

The registration page allows new users to create accounts with validation.

**Features Shown:**
- First Name and Last Name fields (side by side)
- Username field with validation indicator
- Email field with validation
- Password field with visibility toggle
- Confirm Password field
- Terms of Service checkbox
- "Create Account" primary button
- Link to existing login page

![Register Page](./screenshots/02_register_page.png)

**URL:** `/register`

**Form Validation Rules:**
- Username: 3-20 characters, alphanumeric + underscore
- Email: Valid email format required
- Password: Minimum 8 characters with uppercase, lowercase, number, and special character
- Confirm Password: Must match password field

---

### 1.3 Forgot Password Page

Password reset functionality using email-based OTP verification.

**Features Shown:**
- Email input field
- "Send OTP" primary button
- Link back to login page
- Clean, focused layout for password recovery

![Forgot Password Page](./screenshots/03_forgot_password_page.png)

**URL:** `/forgot-password`

**Password Reset Flow:**
1. User enters registered email
2. System sends 6-digit OTP via Resend API
3. User enters OTP and new password
4. Password updated, user redirected to login

---

## 2. Main Application Pages

### 2.1 Dashboard

The main dashboard provides a comprehensive overview of all tasks and productivity metrics.

**Features Shown:**
- **Sidebar Navigation:** Collapsible with user profile, Add Task button, navigation links, and category list
- **Statistics Cards:** Total Tasks, Completed (with percentage), Overdue, Due This Week
- **Task Progress Chart:** Donut chart showing task distribution by status (Pending, In Progress, Completed)
- **Completion Rate:** Large percentage display
- **Pinned Tasks Section:** Quick access to important/pinned tasks
- **Top Search Bar:** Global task search functionality
- **User Menu:** Profile avatar with notification bell

![Dashboard Page](./screenshots/04_dashboard_page.png)

**URL:** `/dashboard`

**Statistics Card Details:**
| Card | Icon | Color | Description |
|------|------|-------|-------------|
| Total Tasks | List icon | Blue | Count of all user tasks |
| Completed | Checkmark | Green | Count with completion percentage |
| Overdue | Warning triangle | Red/Orange | Tasks past due date |
| Due This Week | Calendar | Yellow | Tasks due in next 7 days |

---

### 2.2 Tasks Page

The full task list with advanced filtering, sorting, and search capabilities.

**Features Shown:**
- **Task Count Header:** Shows total number of tasks
- **Search Bar:** Filter tasks by title/description
- **Filter Dropdowns:** Status, Priority, Category, Date Range, Sort Order
- **View Toggle:** List view and Grid view options
- **Task Cards:** Each showing:
  - Completion checkbox (circle)
  - Task title and description
  - Priority badge (Low/Medium/High/Urgent)
  - Category badge with color
  - Due date indicator
  - Pinned indicator (pin icon)
  - Actions menu (three dots)

![Tasks Page](./screenshots/05_tasks_page.png)

**URL:** `/tasks`

**Task Status Visual Indicators:**
| Status | Visual |
|--------|--------|
| Pending | Empty circle, normal text |
| In Progress | Half-filled circle indicator |
| Completed | Filled green circle, strikethrough text |
| Cancelled | Crossed-out appearance |

**Priority Color Coding:**
| Priority | Color | Badge Style |
|----------|-------|-------------|
| Low | Gray | `bg-slate-500` |
| Medium | Blue | `bg-blue-500` |
| High | Orange | `bg-orange-500` |
| Urgent | Red | `bg-red-500` |

---

### 2.3 Profile Page

User profile management with statistics and account settings.

**Features Shown:**
- **Profile Header:** Large avatar with camera icon, username, email
- **User Statistics Cards:** Total Tasks, Completed Tasks, Success Rate percentage
- **Profile Information Form:**
  - First Name field
  - Last Name field
  - Email field (read-only with note "Email cannot be changed")
  - Avatar URL field
  - "Save Changes" button
- **Password Change Section:** (visible when scrolled)

![Profile Page](./screenshots/07_profile_page.png)

**URL:** `/profile`

**Profile Statistics:**
| Metric | Description |
|--------|-------------|
| Total Tasks | All tasks created by user |
| Completed | Tasks marked as completed |
| Success Rate | (Completed / Total) × 100% |

---

## 3. Interactive Features

### 3.1 Add Task Modal

The modal dialog for creating new tasks with all required fields.

**Features Shown:**
- **Title Field:** Required, with character counter (0/200)
- **Description Field:** Optional textarea for task details
- **Priority Selection:** Radio buttons for Low, Medium, High, Urgent
- **Category Dropdown:** Select from user's categories
- **Due Date Picker:** Date and time selection
- **Pin Task Toggle:** Switch to pin important tasks
- **Action Buttons:** Cancel and "Add Task" buttons

![Add Task Modal](./screenshots/06_add_task_modal.png)

**Modal Overlay:** Semi-transparent dark backdrop with centered modal card

**Form Fields:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Title | Text input | Yes | 1-200 characters |
| Description | Textarea | No | Max 2000 characters |
| Priority | Radio group | No | Defaults to Medium |
| Category | Select dropdown | No | User's categories |
| Due Date | DateTime picker | No | Future date recommended |
| Pin Task | Toggle switch | No | Default off |

---

### 3.2 Task Filters

The filtering system with dropdown menus for precise task filtering.

**Features Shown:**
- **Status Filter Dropdown:** All Status, Pending, In Progress, Completed, Cancelled
- **Priority Filter:** All Priority, Low, Medium, High, Urgent
- **Category Filter:** All Categories, Work, Personal, Shopping, Health
- **Date Filter:** All Dates, Today, This Week, Overdue
- **Sort Options:** Created Date, Due Date, Priority, Title (ascending/descending)

![Task Filters](./screenshots/11_task_filters.png)

**Filter Dropdown Open State:** Shows all available options with checkmark on selected item

---

### 3.3 Search Functionality

Global search across task titles and descriptions.

**Features Shown:**
- **Search Input:** "groceries" entered as search term
- **Live Results:** Tasks filtered in real-time as user types
- **Search Indicator:** Search icon in the input field
- **Clear Search:** X button to clear search (when text present)

![Search Tasks](./screenshots/12_search_tasks.png)

**Search Behavior:**
- Case-insensitive matching
- Searches both title and description fields
- Real-time filtering (debounced 300ms)
- Combined with other active filters

---

## 4. Mobile Responsive Views

The application is fully responsive with optimized layouts for mobile devices.

### 4.1 Mobile Login

**Features Shown:**
- Centered layout optimized for mobile
- Touch-friendly input fields
- Full-width sign-in button
- Demo credentials easily visible

![Mobile Login](./screenshots/13_mobile_login.png)

**Viewport:** 375px × 812px (iPhone X)

---

### 4.2 Mobile Dashboard

**Features Shown:**
- **Hamburger Menu:** Replaces sidebar on mobile
- **Compact Header:** Logo and user avatar
- **Statistics Grid:** 2×2 grid layout for stats cards
- **Progress Chart:** Responsive donut chart
- **Bottom Navigation Bar:** Home, Tasks, Add (FAB), Notifications, Profile

![Mobile Dashboard](./screenshots/09_mobile_dashboard.png)

**Viewport:** 375px × 812px (iPhone X)

**Bottom Navigation Items:**
| Icon | Label | Route |
|------|-------|-------|
| Home | Home | `/dashboard` |
| List | Tasks | `/tasks` |
| Plus (FAB) | Add | Opens modal |
| Bell | Notifications | Shows panel |
| User | Profile | `/profile` |

---

### 4.3 Mobile Tasks

**Features Shown:**
- **Compact Header:** Task count and search bar
- **Filter Button:** Collapsible filters panel
- **View Toggle:** List/Grid switch
- **Task Cards:** Full-width cards with all info
- **Bottom Navigation:** Persistent navigation bar

![Mobile Tasks](./screenshots/10_mobile_tasks.png)

**Viewport:** 375px × 812px (iPhone X)

**Mobile Task Card Layout:**
- Title and description
- Priority and category badges (inline)
- Due date indicator
- Pinned icon (top right)
- Tap for actions menu

---

### 4.4 Mobile Profile

**Features Shown:**
- **Centered Profile Header:** Avatar, name, email
- **Statistics Row:** Horizontal scroll if needed
- **Stacked Form Fields:** Full-width inputs
- **Bottom Navigation:** Consistent navigation

![Mobile Profile](./screenshots/14_mobile_profile.png)

**Viewport:** 375px × 812px (iPhone X)

---

## Screenshot Legend

### Color Palette Used

| Element | Color | Hex Code |
|---------|-------|----------|
| Background | Dark Slate | `#0f172a` |
| Card Background | Slate 800 | `#1e293b` |
| Card Border | Slate 700 | `#334155` |
| Primary Blue | Blue 500 | `#3b82f6` |
| Success Green | Emerald 500 | `#10b981` |
| Warning Orange | Orange 500 | `#f97316` |
| Error Red | Red 500 | `#ef4444` |
| Text Primary | Slate 100 | `#f1f5f9` |
| Text Secondary | Slate 400 | `#94a3b8` |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Headings | Inter | 24-32px | 700 |
| Body | Inter | 14-16px | 400 |
| Labels | Inter | 12-14px | 500 |
| Buttons | Inter | 14px | 500 |

### Interactive States

| State | Indicator |
|-------|-----------|
| Hover | Slight background color change |
| Focus | Blue ring outline |
| Active | Pressed/darker state |
| Disabled | Reduced opacity (0.5) |
| Loading | Spinner animation |

---

## How to Reproduce Screenshots

To capture similar screenshots locally:

```bash
# Install Playwright
npm install -D @playwright/test

# Run screenshot script
npx playwright test --project=chromium

# Screenshots saved to ./screenshots folder
```

**Recommended Browser Settings:**
- Desktop: 1920×800px viewport
- Mobile: 375×812px viewport (iPhone X)
- Device scale factor: 1
- Color scheme: Dark mode

---

## Notes

1. **Demo Account:** All screenshots use the demo account (demo@todo.com / Demo@1234)
2. **Sample Data:** Screenshots include pre-seeded sample tasks for demonstration
3. **Dark Theme:** Application uses a dark theme by default (no light mode option)
4. **Responsive Breakpoints:**
   - Mobile: < 768px
   - Tablet: 768px - 1024px
   - Desktop: > 1024px

---

*Screenshots generated: December 2025*  
*Application Version: 1.0.0*  
*Built with: FastAPI + MongoDB + React + Tailwind CSS*
