@echo off
cd backend
start /min cmd /k "npm run dev"
cd ../frontend
start /min cmd /k "npm run dev"
timeout /t 1 >nul
start http://localhost:5173