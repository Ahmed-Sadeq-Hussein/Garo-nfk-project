import os
import pandas as pd

# 1. Change directory to the folder where the Excel file resides
# Will be changed later to an env and gitignore file.
os.chdir(r"F:\Active\NFK GARO\Resources")

# 2. Read the Excel file (adjust the file name/extension if needed)
excel_file = "Entity ifrån Egenskap till Nytta inkl värde i kronor.xlsx"
df = pd.read_excel(excel_file)

# 3. Print DataFrame to command prompt
print(df)


## python -m pip install pandas
