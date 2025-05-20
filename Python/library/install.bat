@echo off
echo Installing required Python packages...

python -m pip install --upgrade pip
python -m pip install readchar
python -m pip install pandas
python -m pip install openpyxl

echo.
echo ✅ All dependencies installed.
pause
