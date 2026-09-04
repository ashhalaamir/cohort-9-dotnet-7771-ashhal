# Task Management Tool - Setup & Admin Creation Guide

> ✅ **This project now runs on .NET 10.0** (Upgraded from .NET 8.0)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![.NET](https://img.shields.io/badge/.NET-10.0-purple.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)

---

## 📋 Quick Start

### Prerequisites/ SKIP TO ONE CLICK COMMANDS IF ALREADY INSTALLED

| Tool | Version | Installation |
|------|---------|--------------|
| **.NET SDK** | **10.0** | [Download](https://dotnet.microsoft.com/download) |
| Node.js | 18.0+ | [Download](https://nodejs.org/) |
| **SQL Server** | **2019+ or LocalDB** | [Download](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) |
| Git | Latest | [Download](https://git-scm.com/) |

---

### INSTALL INSTRUCTIONS

###1. Install SQL Server LocalDB
The project uses SQL Server LocalDB for development. Follow these steps:

Step 1: Download SQL Server 2022 Express
Go to: https://go.microsoft.com/fwlink/p/?linkid=2216019

Download SQL2022-SSEI-Expr.exe

Step 2: Run the Installer
Run the installer as Administrator (right-click → "Run as administrator")

Choose "Custom" installation type

Click "Install" to start the installation

Step 3: Select Features
In the "Feature Selection" screen, make sure you check:

✅ Database Engine Services (under "Instance Features") - REQUIRED

✅ LocalDB (under "Shared Features") - CRITICAL

💡 Note: You can uncheck other features (like Reporting Services, Integration Services) to save disk space.

Step 4: Complete Installation
Click "Next" through the rest of the screens

Leave everything at default settings

Click "Install" and wait for completion

Step 5: Verify Installation
Close and reopen PowerShell, then run:

powershell
sqllocaldb info
You should see mssqllocaldb in the list of instances.

### 2. Install Node.js (for Frontend)
The frontend is built with React 19 and Vite 8, which require Node.js 20+ (v22 LTS recommended).

Version Requirements
Component	Minimum Version	Recommended Version
Node.js	v20.0.0	v22.x LTS
npm	v10.0.0	v10.x (included with Node.js)
Windows Installation
Option A: Download from Website (Recommended)

Go to: https://nodejs.org/

Download the LTS version (v22.x)

Run the installer (this includes npm automatically)

Follow the installation wizard (default settings are fine)

Restart your terminal after installation

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
http://localhost:5000/swagger/index.html

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
