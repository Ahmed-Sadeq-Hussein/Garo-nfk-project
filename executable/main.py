import os
import sys
import json
import math
import shutil
import tkinter as tk
from tkinter import filedialog
import pandas as pd
from collections import defaultdict
from dataclasses import dataclass
from typing import List

# === Settings Handling ===
SETTINGS_PATH = os.path.join("Python", "Resource folder", "settings.txt")

def get_settings():
    if not os.path.exists(SETTINGS_PATH):
        return ask_for_settings()

    excel_file = ""
    sheet_name = ""
    remember = "false"

    with open(SETTINGS_PATH, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if line.startswith("excel_file="):
                excel_file = line.split("=", 1)[1]
            elif line.startswith("sheet_name="):
                sheet_name = line.split("=", 1)[1]
            elif line.startswith("remember="):
                remember = line.split("=", 1)[1].lower()

    if remember == "true":
        return excel_file, sheet_name
    else:
        return ask_for_settings()

def ask_for_settings():
    root = tk.Tk()
    root.withdraw()
    file_path = filedialog.askopenfilename(title="Select Excel file", filetypes=[("Excel files", "*.xlsx")])
    if not file_path:
        raise Exception("No file selected.")
    
    sheet_name = input("Enter the sheet name (or press Enter if there's only one): ").strip()
    if not sheet_name:
        sheet_name = "Entity"

    remember_choice = input("Use this path as default in the future? (y/n): ").strip().lower()
    remember = "true" if remember_choice == "y" else "false"

    os.makedirs(os.path.dirname(SETTINGS_PATH), exist_ok=True)

    with open(SETTINGS_PATH, "w", encoding="utf-8") as f:
        f.write("# Settings for Excel processing\n")
        f.write(f"excel_file={file_path}\n")
        f.write(f"sheet_name={sheet_name}\n")
        f.write(f"remember={remember}\n")

    return file_path, sheet_name

# === Feature Data Definition ===

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
    return [read_feature_from_row(row) for _, row in df.iterrows()]

# === JSON Export ===

def clean_dict(d):
    return {
        k: ("Inget innehåll" if isinstance(v, float) and math.isnan(v) else v)
        for k, v in d.items()
    }

def sanitize_filename(name: str) -> str:
    return "".join(c for c in name if c.isalnum() or c in (' ', '_', '-')).strip()

def export_features_to_json():
    path, sheet_name = get_settings()
    features = load_features(path, sheet_name)

    EXPORT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "resource json"))
    ROUTES_FILE = os.path.join(EXPORT_DIR, "routes.json")
    TAG_COUNTS_FILE = os.path.join(EXPORT_DIR, "tagCounts.json")

    TAG_COLUMN_MAPPING = {
        "Garo": "Garo",
        "Säkerhet": "Säkerhet",
        "Driftsäkerhet": "Driftsäkerhet",
        "Installation": "Installation",
        "användarvänligt": "användarvänligt",
        "Smarta funktioner": "Smartafunktioner",
        "Ekonomi": "Ekonomi"
    }

    if os.path.exists(EXPORT_DIR):
        shutil.rmtree(EXPORT_DIR)
    os.makedirs(EXPORT_DIR)

    routes = []
    tag_counts = defaultdict(int)

    for feature in features:
        safe_name = sanitize_filename(feature.egenskap) or "unnamed"
        file_path = os.path.join(EXPORT_DIR, f"{safe_name}.json")

        feature_dict = clean_dict(vars(feature))

        tags = []
        for tag in TAG_COLUMNS:
            attr_name = TAG_COLUMN_MAPPING[tag]
            if getattr(feature, attr_name, 0) == 1:
                tags.append(tag)
                tag_counts[tag] += 1

        feature_dict["tags"] = tags

        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(feature_dict, f, ensure_ascii=False, indent=2)

        routes.append({
            "file": f"{safe_name}.json",
            "title": feature_dict.get("egenskap", "unnamed"),
            "tags": tags
        })

    with open(ROUTES_FILE, "w", encoding="utf-8") as f:
        json.dump(routes, f, ensure_ascii=False, indent=2)

    with open(TAG_COUNTS_FILE, "w", encoding="utf-8") as f:
        json.dump(tag_counts, f, ensure_ascii=False, indent=2)

    print(f"✅ Exported {len(features)} features to '{EXPORT_DIR}'")
    print("📦 routes.json created.")
    print("📊 tagCounts.json created.")

if __name__ == "__main__":
    export_features_to_json()
