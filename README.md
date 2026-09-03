markdown
# Task Management Tool - Setup & Admin Creation Guide

> ⚠️ **IMPORTANT: This project requires .NET 8.0 SDK, SQL EXPRESS LOCALDB AND NODE.JS  FOR FRONTEND .**
> If you have .NET 10 or later installed, you still need .NET 8.0 to run this project. Multiple .NET versions can coexist on the same machine.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![.NET](https://img.shields.io/badge/.NET-8.0-purple.svg)
![React](https://img.shields.io/badge/React-19.2.8-blue.svg)
![Node](https://img.shields.io/badge/Node-22.x-green.svg)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Prerequisite | Version | Purpose |
|-------------|---------|---------|
| **.NET SDK** | 8.0 (LTS) | Backend API |
| **SQL Server LocalDB** | 2022 Express | Database |
| **Node.js** | 20.x or 22.x (LTS) | Frontend |
| **npm** | 10.x+ | Package Manager |
| **Git** | Latest | Version Control |

---

## 🔴 IMPORTANT: .NET Version 8.0 and SQL EXPRESS 2022 REQUIREMENT

### ⚠️ YOU MUST USE .NET 8.0

| Requirement | Details |
|-------------|---------|
| **Required SDK** | **.NET 8.0** (LTS) |
| **Why .NET 8?** | This project is built for .NET 8.0. .NET 10 is NOT compatible. |
| **Multiple Versions** | You CAN have both .NET 8 and .NET 10 installed together. |

### Check Your .NET Version

powershell
dotnet --version

📦 Installation Instructions
1. Install .NET 8.0 SDK
Windows Installation
Download .NET 8.0 SDK

Go to: https://dotnet.microsoft.com/en-us/download/dotnet/8.0

Download the .NET 8.0 SDK (not just the runtime)

Choose the Windows x64 installer

Install .NET 8.0

Run the downloaded installer

Follow the installation wizard (default settings are fine)

Restart your terminal/command prompt after installation

Verify Installation

powershell
dotnet --version
Should output: 8.0.xxx

macOS Installation
bash
# Using Homebrew
brew install dotnet@8

# Or download from: https://dotnet.microsoft.com/en-us/download/dotnet/8.0
Linux (Ubuntu/Debian)
bash
# Add Microsoft package repository
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

# Install .NET 8.0 SDK
sudo apt-get update
sudo apt-get install -y dotnet-sdk-8.0
2. Install SQL Server LocalDB
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

3. Install Node.js (for Frontend)
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

Option B: Install via Command Line

powershell
# Using Windows Package Manager
winget install OpenJS.NodeJS.LTS
Option C: Using NVM (Node Version Manager)
If you need to manage multiple Node.js versions:

Install NVM for Windows: https://github.com/coreybutler/nvm-windows/releases

Then install the required version:

powershell
nvm install 22.11.0
nvm use 22.11.0
Verify Installation
powershell
node --version   # Should show v20.x.x or v22.x.x
npm --version    # Should show 10.x.x or higher
💡 Windows PowerShell Users: If you encounter npm.ps1 cannot be loaded errors, use Command Prompt instead of PowerShell, or run npm.cmd instead of npm.

macOS Installation
bash
# Using Homebrew
brew install node

# Using NVM (recommended for version management)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 22
nvm use 22
Linux Installation (Ubuntu/Debian)
bash
# Using NodeSource
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
4. Install Git
Windows
Download and install Git from: https://git-scm.com/download/win

Verify Installation
powershell
git --version
✅ Quick Prerequisite Check
Run these commands to verify everything is installed before starting:

powershell
# Check .NET
dotnet --version        # Should show 8.0.xxx

# Check SQL Server LocalDB
sqllocaldb info         # Should show mssqllocaldb

# Check Node.js
node --version          # Should show v20.x.x or v22.x.x

# Check npm
npm --version           # Should show 10.x.x or higher

# Check Git
git --version           # Should show 2.x.x or higher
🚀 One-Click Setup (Windows PowerShell)
powershell
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
OPEN A NEW TERMINAL WINDOW

powershell
# Frontend (Terminal 2)
cd frontend/task-management-ui
npm install
npm run dev
🚀 One-Click Setup (macOS/Linux)
bash
# Clone and setup
git clone https://github.com/ashhalaamir/cohort-9-dotnet-7771-ashhal.git
cd cohort-9-dotnet-7771-ashhal
git checkout develop

# Backend (Terminal 1)
cd backend
dotnet restore
dotnet build
dotnet ef database update --project TaskManagement.Infrastructure --startup-project TaskManagement.API
dotnet run --project TaskManagement.API --urls="http://localhost:5000"

# Frontend (Terminal 2)
cd frontend/task-management-ui
npm install
npm run dev
👤 Create Admin User
After both backend and frontend are running:

Step 1: Open Swagger
Open your browser and go to: http://localhost:5000/swagger

Step 2: Find Register Endpoint
Look for POST /api/Auth/register and click to expand

Step 3: Click "Try it out"
Step 4: Enter Admin Credentials
json
{
  "username": "adminuser",
  "email": "admin@example.com",
  "password": "Admin123!",
  "role": "Admin"
}
Step 5: Click Execute
The admin user will be created in the database.

Step 6: Login
Use the login screen on the frontend with the credentials above.

🐛 Troubleshooting
"dotnet-ef" command not found
powershell
dotnet tool install --global dotnet-ef
"npm.ps1 cannot be loaded" Error
Solution: Use Command Prompt instead of PowerShell, or run:

powershell
npm.cmd install
npm.cmd run dev
SQL Server LocalDB Connection Issues
powershell
# Verify LocalDB is running
sqllocaldb info

# Start if not running
sqllocaldb start mssqllocaldb

# Recreate if necessary
sqllocaldb stop mssqllocaldb
sqllocaldb delete mssqllocaldb
sqllocaldb create mssqllocaldb
Port 5000 Already in Use
powershell
dotnet run --project TaskManagement.API --urls="http://localhost:5001"
Node.js Version Mismatch
Check your Node version:

powershell
node --version
If below v20, upgrade or use NVM to switch versions.

📊 Running Applications
After successful setup:

Application	URL
Backend API	http://localhost:5000
Swagger UI	http://localhost:5000/swagger
Frontend	http://localhost:5173
💡 Note: The initial 404 errors when starting the backend are normal until you access a valid endpoint or the Swagger UI.

text

---

This README is now comprehensive and should work for anyone setting up the project from scratch! 👍
