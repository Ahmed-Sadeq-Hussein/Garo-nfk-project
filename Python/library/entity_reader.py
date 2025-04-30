import pandas as pd
from dataclasses import dataclass
from typing import List
import os

# === Settings ===
SHEET_NAME = "Entity"
EXCEL_FILE = "Entity ifrån Egenskap till Nytta inkl värde i kronor.xlsx"
PATH = f"F:/Active/NFK GARO/Resources/{EXCEL_FILE}"

# These correspond to the binary tag columns in the Excel file
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
    tags: List[str]

def read_feature_from_row(row) -> Feature:
    def safe_get(col):
        value = row.get(col, "")
        return "" if pd.isna(value) else str(value).strip()

    tags = [col for col in TAG_COLUMNS if row.get(col, 0) == 1]

    return Feature(
        egenskap=safe_get('Egenskap'),
        fordel=safe_get('Kundfördel'),
        nytta=safe_get('Tänkbar Nytta'),
        problem=safe_get('Tänkbara Problem'),
        anledning=safe_get('Anledning till att ha'),
        cost=safe_get('Värde'),
        beskrivning=safe_get('Beskrivning'),
        reference=safe_get('Reference'),
        tags=tags
    )

def load_features(path: str, sheet_name: str) -> List[Feature]:
    if not os.path.exists(path):
        raise FileNotFoundError("❌ Excel file not found at: " + path)

    df = pd.read_excel(path, sheet_name=sheet_name)
    df = df.dropna(subset=["Egenskap"])
    return [read_feature_from_row(row) for _, row in df.iterrows()]

# Preview
if __name__ == "__main__":
    features = load_features(PATH, SHEET_NAME)
    for f in features:
        print(f"{f.egenskap} => Tags: {f.tags}")
