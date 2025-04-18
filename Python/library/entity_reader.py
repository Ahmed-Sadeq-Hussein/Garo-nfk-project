import pandas as pd
from dataclasses import dataclass
from typing import List
import os

## python -m pip install pandas

### Settings
SHEET_NAME = "Entity"
EXCEL_FILE = "Entity ifrån Egenskap till Nytta inkl värde i kronor.xlsx"
PATH = f"F:/Active/NFK GARO/Resources/{EXCEL_FILE}"

@dataclass
class Feature:
    egenskap: str
    fordel: str
    nytta: str
    problem: str
    anledning: str
    cost: str
    beskrivning: str

def read_feature_from_row(row) -> Feature:
    return Feature(
        egenskap=row.get('Egenskap', ''),
        fordel=row.get('Kundfördel', ''),
        nytta=row.get('Tänkbar Nytta', ''),
        problem=row.get('Tänkbara Problem', ''),
        anledning=row.get('Anledning till att ha', ''),
        cost=row.get('Värde', ''),
        beskrivning=row.get('Beskrivning', '')
    )

def load_features(path: str, sheet_name: str) -> List[Feature]:
    if not os.path.exists(path):
        raise FileNotFoundError(f"Excel file not found at: {path}")
    
    df = pd.read_excel(path, sheet_name=sheet_name)
    df = df.dropna(subset=["Egenskap"])  # Filter out completely empty entries
    features = [read_feature_from_row(row) for _, row in df.iterrows()]
    return features

# Run and preview
if __name__ == "__main__":
    features = load_features(PATH, SHEET_NAME)
    for f in features:
        print(f , "\n \n")

