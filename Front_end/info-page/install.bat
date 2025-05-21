@echo off
setlocal
REM === Ahmed Hussein installation of node libraries. ===
REM === Step 1: Set folder name ===
set "APP_NAME=garo-app"

REM === Step 2: Create the React app if not already created ===
if not exist "%APP_NAME%\node_modules" (
    echo 🔧 Creating React app...
    npx create-react-app %APP_NAME%
)

REM === Step 3: Navigate into the app folder ===
cd %APP_NAME%

REM === Step 4: Install required npm packages ===
echo 📦 Installing required packages...
call npm install react-router-dom recharts

REM === Step 5: Start the React development server ===
echo 🚀 Starting the React app...
call npm start

endlocal
