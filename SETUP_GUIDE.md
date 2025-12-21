# Setup Guide - Smart Load Optimize

This guide will help you set up and run the Smart Truck Loading Optimization System on a new laptop.

## Prerequisites

Before you begin, make sure you have the following installed:

### 1. Node.js and npm
- **Required Version**: Node.js 16.x or higher
- **Installation**: Download from [nodejs.org](https://nodejs.org/) or install using [nvm](https://github.com/nvm-sh/nvm)

To verify installation:
```bash
node --version
npm --version
```

### 2. Git (Optional - for cloning)
- Download from [git-scm.com](https://git-scm.com/)

## Installation Steps

### Step 1: Get the Project Files

**Option A: Clone from Git**
```bash
git clone <YOUR_GIT_URL>
cd smart-load-optimize-main
```

**Option B: Copy the Project Folder**
- Simply copy the entire `smart-load-optimize-main` folder to your friend's laptop
- Open Terminal/Command Prompt and navigate to the project directory:
```bash
cd path/to/smart-load-optimize-main
```

### Step 2: Install Frontend Dependencies

From the project root directory:
```bash
npm install
```

This will install all the required frontend dependencies including:
- React
- Vite
- Tailwind CSS
- shadcn-ui components
- Three.js for 3D visualizations
- And many more...

### Step 3: Install Backend Dependencies

Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
cd ..
```

This will install:
- Express.js (web server)
- SQLite database
- Authentication libraries
- CORS middleware

### Step 4: Configure Backend Environment

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a `.env` file by copying the example:
```bash
cp .env.example .env
```

3. Edit the `.env` file if needed (the defaults should work fine):
```
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

> [!TIP]
> For production deployment, make sure to change the `JWT_SECRET` to a strong, random string.

4. Return to the project root:
```bash
cd ..
```

## Running the Application

You need to run both the frontend and backend servers simultaneously.

### Option 1: Using Two Terminal Windows (Recommended)

**Terminal 1 - Frontend:**
```bash
npm run dev
```
This will start the frontend development server (usually on `http://localhost:5173`)

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```
This will start the backend API server on `http://localhost:3001`

### Option 2: Using Background Processes

**On macOS/Linux:**
```bash
# Start backend in background
cd backend && npm run dev &
cd ..

# Start frontend
npm run dev
```

**On Windows (PowerShell):**
```powershell
# Start backend in new window
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory ".\backend"

# Start frontend
npm run dev
```

## Accessing the Application

Once both servers are running:

1. Open your web browser
2. Navigate to: `http://localhost:5173` (or the URL shown in the frontend terminal)
3. The application should load and connect to the backend automatically

## Troubleshooting

### Port Already in Use

If you see an error like "Port 5173 is already in use" or "Port 3001 is already in use":

**Find and kill the process:**

On macOS/Linux:
```bash
# For frontend (port 5173)
lsof -ti:5173 | xargs kill -9

# For backend (port 3001)
lsof -ti:3001 | xargs kill -9
```

On Windows:
```powershell
# For frontend (port 5173)
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# For backend (port 3001)
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F
```

### Missing Dependencies

If you encounter errors about missing modules:
```bash
# Reinstall frontend dependencies
rm -rf node_modules package-lock.json
npm install

# Reinstall backend dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
cd ..
```

### Database Issues

If you encounter database errors, the SQLite database file might be corrupted:
```bash
cd backend
rm database.sqlite
# The database will be recreated automatically when you restart the backend
npm run dev
```

### Node Version Issues

If you're having compatibility issues, try using Node.js version 18 or 20 (LTS versions):
```bash
# Using nvm
nvm install 20
nvm use 20
```

## Project Structure

```
smart-load-optimize-main/
├── backend/              # Backend API server
│   ├── server.js        # Main server file
│   ├── database.js      # Database configuration
│   ├── routes/          # API routes
│   ├── models/          # Data models
│   ├── services/        # Business logic
│   └── .env             # Environment variables
├── src/                 # Frontend source code
│   ├── components/      # React components
│   ├── pages/           # Page components
│   └── lib/             # Utilities and helpers
├── public/              # Static assets
└── package.json         # Frontend dependencies
```

## Features

This application provides:
- 🚚 Smart truck loading optimization
- 📊 3D visualization of load distribution
- 📈 Analytics and reporting
- 👤 User authentication
- 💾 Local SQLite database

## Development Commands

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter

### Backend
- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server

## Need Help?

If you encounter any issues not covered in this guide:

1. Check that both servers are running
2. Verify all dependencies are installed
3. Check the browser console for errors (F12)
4. Check the terminal output for error messages
5. Ensure you're using a compatible Node.js version

---

**Happy Coding! 🚀**
