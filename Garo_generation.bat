@echo off
REM  Ash's full pipeline runner (with cleaning)
REM is the Intellectual property of Garo group ab. :3 .

REM === STEP 0: Clean old generated content ===
echo  Cleaning old builds...
cd /d "%~dp0Python\library"
python delete.py
if %errorlevel% neq 0 (
    echo  delete.py failed. Aborting.
    pause
    exit /b
)

REM === STEP 1: Run export_json.py (outputs to root/resource json) ===
echo Running export_json.py...
python export_json.py
if %errorlevel% neq 0 (
    echo  export_json.py failed. Aborting.
    pause
    exit /b
)

REM === STEP 2: Run Node.js generatePages.js from root ===
echo Running generatePages.js...
cd /d "%~dp0"
node generatePages.js
if %errorlevel% neq 0 (
    echo  generatePages.js failed. Aborting.
    pause
    exit /b
)

REM === STEP 3: Start React app ===
echo Starting React app...
cd /d "%~dp0Front_end\info-page"
start npm start

echo  Done! Your full stack is now live.
pause
