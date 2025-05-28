@echo off
setlocal

REM === Step 1: Optional - Run Node script if needed ===
REM call node generatePages.js

REM === Step 2: Go to React project and install ===
echo  Installing React app dependencies...
pushd "Front_end\info-page"

REM Pause briefly for file system safety
timeout /t 1 >nul

call install.bat

popd

echo  All installations completed.
endlocal
