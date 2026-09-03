# Task Management Tool Overview (FILES IN DEVELOP)

> A full-stack task management web application built with ASP.NET Core and React.js

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![.NET](https://img.shields.io/badge/.NET-8.0-purple.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 📋[SWITCH BRANCH TO DEVELOP FOR PROJECT FILES AND DETAILED SETUP INSTRUCTIONS GIVEN IN DEVELOP BRANCH'S README]

This project is a complete task management system developed as part of the **10Pearls Shine Cohort 9 (.NET Fullstack)** internship. It enables users to organize, track, and manage tasks with role-based access control.

BRANCH MERGING STRATEGY: Each branch was corrected for Coderabbit fixes, approved and then merged with the following new branch. Final branch (feature/frontend-task-screens) was then merged with develop, which holds the full project.

### 🎯 Key Features

| Feature | Description |
|---------|-------------|
| **🔐 Authentication** | JWT-based login/register with role-based access (Admin/RegularUser) |
| **📋 Task Management** | Complete CRUD operations with status, priority, categories, and due dates |
| **📊 Dashboard** | Real-time statistics with task counts, status breakdown, and priority distribution |
| **🔍 Search & Filter** | Powerful filtering by status, priority, category, and search terms |
| **👥 Team Management** | Admin-only team overview with user statistics and completion rates |
| **📝 Activity Tracking** | Visual heatmap showing task completion activity over 14 weeks |
| **🔒 Security** | Password hashing (PBKDF2), JWT tokens, role-based authorization |
| **📊 Logging** | Structured logging with Serilog (console + file) |
| **🧪 Testing** | 53+ unit tests with xUnit, Moq, and FluentAssertions |
| **📈 Code Quality** | SonarQube integration for continuous code analysis |

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| ASP.NET Core | 8.0 | Web API Framework |
| Entity Framework Core | 8.0 | ORM for database access |
| SQL Server | - | Relational database |
| Serilog | - | Structured logging |
| JWT | - | Authentication |
| xUnit | - | Unit testing |
| Moq | - | Mocking for tests |
| SonarQube | - | Code quality analysis |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Framework |
| TypeScript | 5.0 | Type-safe JavaScript |
| Tailwind CSS | 3.0 | Styling |
| React Router | 6.0 | Navigation |
| Axios | - | HTTP client |
| Lucide React | - | Icons |

---

## 📁 Project Structure
Task-Management-Tool/
├── backend/
│ ├── TaskManagement.API/ # Web API Layer
│ │ ├── Controllers/ # API endpoints
│ │ ├── DTOs/ # Data Transfer Objects
│ │ ├── Middleware/ # Global exception handling
│ │ └── Program.cs # Application entry point
│ ├── TaskManagement.Core/ # Business Logic Layer
│ │ ├── Models/ # Domain models (User, Task)
│ │ ├── Interfaces/ # Service contracts
│ │ ├── Services/ # Business logic
│ │ └── Helpers/ # Utilities (PasswordHasher)
│ ├── TaskManagement.Infrastructure/ # Data Access Layer
│ │ ├── Data/ # ApplicationDbContext
│ │ ├── Repositories/ # Data access implementations
│ │ └── Migrations/ # EF Core migrations
│ └── TaskManagement.Tests/ # Unit Tests
│ ├── Services/ # Service tests
│ ├── Repositories/ # Repository tests
│ └── Helpers/ # Helper tests
├── frontend/
│ └── task-management-ui/
│ ├── src/
│ │ ├── api/ # API clients
│ │ ├── components/ # React components
│ │ │ ├── auth/ # Login/Register
│ │ │ ├── common/ # Shared components
│ │ │ ├── dashboard/ # Dashboard
│ │ │ ├── tasks/ # Task CRUD screens
│ │ │ ├── profile/ # User profile
│ │ │ └── team/ # Team overview (Admin)
│ │ ├── context/ # React Context (Auth)
│ │ ├── hooks/ # Custom hooks
│ │ ├── types/ # TypeScript interfaces
│ │ └── utils/ # Helper functions
│ ├── tailwind.config.js # Tailwind configuration
│ └── package.json # Dependencies
├── docs/
│ └── DatabaseSchema.md # Database design
├── .gitignore
└── README.md


---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Installation |
|------|---------|--------------|
| .NET SDK | 8.0+ | [Download](https://dotnet.microsoft.com/download) |
| Node.js | 18.0+ | [Download](https://nodejs.org/) |
| SQL Server | 2019+ or LocalDB | [Download](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) |
| Git | Latest | [Download](https://git-scm.com/) |

---

### Backend Setup

```bash
# 1. Navigate to backend folder
cd backend

# 2. Restore dependencies
dotnet restore

# 3. Build the solution
dotnet build

# 4. Apply database migrations
dotnet ef database update --project TaskManagement.Infrastructure --startup-project TaskManagement.API

# 5. Run the API
dotnet run --project TaskManagement.API --urls="http://localhost:5000"

# 6. Open Swagger
# http://localhost:5000/swagger

FRONTEND SETUP

# 1. Navigate to frontend folder
cd frontend/task-management-ui

# 2. Install dependencies
npm install

# 3. Create .env file
echo "VITE_API_BASE_URL=http://localhost:5000" > .env

# 4. Start development server
npm run dev

# 5. Open the application
# http://localhost:5173

pplication Screens
Screen	Description	Features
1. Sign Up/Log In	User authentication	Registration, Login, JWT token
2. Dashboard	Overview of tasks	Task counts, status breakdown, priority distribution, recent tasks
3. Task List	Manage all tasks	Filters, search, sorting, role-based columns
4. Task Detail	View single task	Properties, status update, edit/delete
5. New/Edit Task	Create/Update tasks	Full form with validation, admin assignment
6. User Profile	Manage account	Edit profile, change password, activity heatmap
👥 Roles & Permissions
Action	Regular User	Admin
View Tasks	Only their own	ALL tasks
Create Task	Self-assigned only	Can assign to anyone
Update Task	Own tasks only	ANY task
Delete Task	Own tasks only	ANY task
Assign Task	❌ Not allowed	✅ Can assign to anyone
View Team	❌ Not allowed	✅ All users
Dashboard Stats	Own stats only	System-wide stats
🧪 Testing
Run Backend Tests
bash
cd backend
dotnet test
Test Coverage
Test Class	Tests	Status
AuthServiceTests	6	✅ Passing
TaskServiceTests	10	✅ Passing
UserServiceTests	6	✅ Passing
UserRepositoryTests	6	✅ Passing
TaskRepositoryTests	6	✅ Passing
PasswordHasherTests	4	✅ Passing
JwtSettingsTests	2	✅ Passing
Total	53	✅ All Passing
📊 Database Schema
Tables
Users
Column	Type	Description
Id	int (PK)	Unique user ID
Username	nvarchar(100)	User's display name
Email	nvarchar(150)	User's email (unique)
PasswordHash	nvarchar(max)	Hashed password
Role	nvarchar(50)	Admin / RegularUser
CreatedAt	datetime2	Registration date
Tasks
Column	Type	Description
Id	int (PK)	Unique task ID
Title	nvarchar(200)	Task title
Description	nvarchar(1000)	Task description
Status	nvarchar(50)	Pending / InProgress / Completed
Priority	nvarchar(50)	Low / Medium / High
Category	nvarchar(100)	Work / Personal / Urgent
DueDate	datetime2	Due date
UserId	int (FK)	Assigned user
🐳 API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login and get JWT token
POST	/api/auth/change-password	Change user password
Tasks
Method	Endpoint	Description
GET	/api/tasks	Get all tasks (filterable)
GET	/api/tasks/{id}	Get task by ID
POST	/api/tasks	Create a new task
PUT	/api/tasks/{id}	Update a task
DELETE	/api/tasks/{id}	Delete a task
POST	/api/tasks/{id}/assign	Assign task to user (Admin only)
Dashboard
Method	Endpoint	Description
GET	/api/dashboard/stats	Get statistics
GET	/api/dashboard/stats/admin	System-wide stats (Admin only)
GET	/api/dashboard/team	Team statistics (Admin only)
Users
Method	Endpoint	Description
GET	/api/users/profile	Get current user profile
PUT	/api/users/profile	Update user profile
GET	/api/users/all	Get all users (Admin only)
📝 Logging
The application uses Serilog for structured logging:

Console logging for development

File logging with daily rolling (7-day retention)

Request logging for all HTTP requests

Exception logging via global middleware

User activity logging for all actions

Logs are stored in: backend/logs/log-{date}.txt

🔧 Configuration
Backend Configuration (appsettings.json)
json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=TaskManagementDB;Trusted_Connection=True;"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyHere",
    "Issuer": "TaskManagementAPI",
    "Audience": "TaskManagementClient",
    "ExpiryInDays": 7
  }
}
Frontend Configuration (.env)
env
VITE_API_BASE_URL=http://localhost:5000
📦 Deployment
Build for Production
Backend:

bash
cd backend
dotnet publish -c Release -o ./publish
Frontend:

bash
cd frontend/task-management-ui
npm run build
🤝 Contributors
Name	Role
Ashhal Aamir	Full Stack Developer
📄 License
This project is developed as part of the 10Pearls Shine Cohort 9 (.NET Fullstack) internship program.

🙏 Acknowledgments
10Pearls for the internship opportunity

Mentor for guidance and code reviews

Open-source community for the amazing tools

📞 Contact
GitHub: ashhalaamir

Project URL: https://github.com/ashhalaamir/cohort-9-dotnet-7771-ashhal


</div> ```
📋 Summary of README Updates
Section	Content
Overview	Project description and key features
Tech Stack	Backend and frontend technologies
Project Structure	Complete folder structure
Getting Started	Setup instructions for backend and frontend
Application Screens	All 6 screens with descriptions
Roles & Permissions	Admin vs Regular User comparison
Testing	Test coverage and commands
Database Schema	Table structures
API Endpoints	All available endpoints
Logging	Serilog configuration
Configuration	appsettings.json and .env
Deployment	Build commands
