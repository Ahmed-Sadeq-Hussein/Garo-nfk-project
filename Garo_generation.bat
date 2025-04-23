@echo off
REM 🚀 Ash's full pipeline runner

REM === STEP 1: Run Python export_json ===
echo Running export_json.py...
cd /d "%~dp0Python\library"
python export_json.py
if %errorlevel% neq 0 (
    echo ❌ export_json.py failed. Aborting.
    pause
    exit /b
)

REM === STEP 2: Run Node.js generatePages.js ===
echo Running generatePages.js...
cd /d "%~dp0"
node generatePages.js
if %errorlevel% neq 0 (
    echo ❌ generatePages.js failed. Aborting.
    pause
    exit /b
)

REM === STEP 3: Launch React app ===
echo Starting React app...
cd /d "%~dp0Front_end\info-page"
start npm start

echo ✅ Done! Your full stack is now live.
pause
