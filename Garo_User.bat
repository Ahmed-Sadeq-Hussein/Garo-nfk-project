@echo off
REM  Ash's full pipeline runner (with cleaning)
REM  Is the intellectual property of Garo Group AB. :3

REM === STEP 0: Clean + Export using compiled Python EXE ===
echo Running main.exe for cleanup and Excel export...
cd /d "%~dp0"
.\main.exe
if %errorlevel% neq 0 (
    echo  main.exe failed. Aborting.
    pause
    exit /b
)

REM === STEP 1: Run Node.js generatePages.js from root ===
echo Running generatePages.js...
node generatePages.js
if %errorlevel% neq 0 (
    echo  generatePages.js failed. Aborting.
    pause
    exit /b
)

REM === STEP 2: Start React app ===
echo Starting React app...
cd /d "%~dp0Front_end\info-page"
start npm start

echo Done! Your full stack is now live.
pause
