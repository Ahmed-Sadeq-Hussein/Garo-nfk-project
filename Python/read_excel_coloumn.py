import os
import pandas as pd

os.chdir(r"F:\Active\NFK GARO\Resources")

df = pd.read_excel("Entity ifrån Egenskap till Nytta inkl värde i kronor.xlsx", header=1)

# Show the exact column names pandas recognizes
print(df.columns.to_list())





