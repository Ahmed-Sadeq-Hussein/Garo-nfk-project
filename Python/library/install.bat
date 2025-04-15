@echo off
echo Installing required Python packages...

python -m pip install --upgrade pip
python -m pip install readchar
python -m pip install pandas

echo.
echo ✅ All dependencies installed.
pause
