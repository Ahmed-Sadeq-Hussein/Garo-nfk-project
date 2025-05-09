import pandas as pd
from dataclasses import dataclass
from typing import List
import os

# === Settings ===
SHEET_NAME = "Entity"
EXCEL_FILE = "Entity ifrån Egenskap till Nytta inkl värde i kronor.xlsx"
PATH = f"F:/Active/NFK GARO/Resources/{EXCEL_FILE}"

# === Tag columns matching Excel header names ===
TAG_COLUMNS = [
    "Garo",
    "Säkerhet",
    "Driftsäkerhet",
    "Installation",
    "användarvänligt",
    "Smarta funktioner",
    "Ekonomi"
]

@dataclass
class Feature:
    egenskap: str
    fordel: str
    nytta: str
    problem: str
    anledning: str
    cost: str
    beskrivning: str
    reference: str
    Garo: int
    Säkerhet: int
    Driftsäkerhet: int
    Installation: int
    användarvänligt: int
    Smartafunktioner: int
    Ekonomi: int
    
def safe_int(value):
    try:
        return int(value)
    except (ValueError, TypeError):
        return 0

def read_feature_from_row(row) -> Feature:
    return Feature(
        egenskap=str(row.get('Egenskap', '') or ''),
        fordel=str(row.get('Kundfördel', '') or ''),
        nytta=str(row.get('Tänkbar Nytta', '') or ''),
        problem=str(row.get('Tänkbara Problem', '') or ''),
        anledning=str(row.get('Anledning till att ha', '') or ''),
        cost=str(row.get('Värde', '') or ''),
        beskrivning=str(row.get('Beskrivning', '') or ''),
        reference=str(row.get('Reference', '') or ''),
        Garo=safe_int(row.get('Garo')),
        Säkerhet=safe_int(row.get('Säkerhet')),
        Driftsäkerhet=safe_int(row.get('Driftsäkerhet')),
        Installation=safe_int(row.get('Installation')),
        användarvänligt=safe_int(row.get('användarvänligt')),
        Smartafunktioner=safe_int(row.get('Smarta funktioner')),
        Ekonomi=safe_int(row.get('Ekonomi'))
    )


def load_features(path: str, sheet_name: str) -> List[Feature]:
    if not os.path.exists(path):
        raise FileNotFoundError(f"Excel file not found at: {path}")

    df = pd.read_excel(path, sheet_name=sheet_name)
    df = df.dropna(subset=["Egenskap"])
    features = [read_feature_from_row(row) for _, row in df.iterrows()]
    return features

if __name__ == "__main__":
    features = load_features(PATH, SHEET_NAME)
    for f in features:
        print(f)
