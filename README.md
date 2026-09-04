# Task Management Tool - Setup & Admin Creation Guide

> ✅ **This project now runs on .NET 10.0** (Upgraded from .NET 8.0)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![.NET](https://img.shields.io/badge/.NET-10.0-purple.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)

---

## 📋 Quick Start

### Prerequisites

| Tool | Version | Installation |
|------|---------|--------------|
| **.NET SDK** | **10.0** | [Download](https://dotnet.microsoft.com/download) |
| Node.js | 18.0+ | [Download](https://nodejs.org/) |
| **SQL Server** | **2019+ or LocalDB** | [Download](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) |
| Git | Latest | [Download](https://git-scm.com/) |

---

## 🚀 One-Click Setup (Windows PowerShell)

```powershell
# Clone and setup
git clone https://github.com/ashhalaamir/cohort-9-dotnet-7771-ashhal.git
cd cohort-9-dotnet-7771-ashhal
git checkout develop

# Backend (Terminal 1)
cd backend
dotnet restore
dotnet build
dotnet tool install --global dotnet-ef
dotnet ef database update --project TaskManagement.Infrastructure --startup-project TaskManagement.API
dotnet run --project TaskManagement.API --urls="http://localhost:5000"

Open a New Terminal Window for Frontend
bash
# Frontend (Terminal 2)
cd frontend/task-management-ui
npm install
npm run dev

Creating an Admin Account
The frontend registration creates Regular Users by default. To create an Admin, use Swagger.

Step 1: Open Swagger
Open your browser and go to:
http://localhost:5000/swagger

Step 2: Find the Register Endpoint
Scroll down to the Auth section and find:
POST /api/Auth/register

Step 3: Click "Try it out"
Click the "Try it out" button.

Step 4: Enter Admin Details
Replace the example with:

json
{
  "username": "adminuser",
  "email": "admin@example.com",
  "password": "Admin123!",
  "role": "Admin"
}

Step 5: Execute
Click the "Execute" button.
