import os
import json
import shutil
import math
from entity_reader import load_features, PATH, SHEET_NAME

EXPORT_DIR = "resource json"
ROUTES_FILE = os.path.join(EXPORT_DIR, "routes.json")

def clean_dict(d):
    """Replace NaN or float NaNs with a placeholder string."""
    return {
        k: ("Inget innehåll" if isinstance(v, float) and math.isnan(v) else v)
        for k, v in d.items()
    }

def sanitize_filename(name: str) -> str:
    """Make filename safe for filesystem."""
    return "".join(c for c in name if c.isalnum() or c in (' ', '_', '-')).strip()

def export_features_to_json():
    features = load_features(PATH, SHEET_NAME)

    # Clear and recreate export folder
    if os.path.exists(EXPORT_DIR):
        shutil.rmtree(EXPORT_DIR)
    os.makedirs(EXPORT_DIR)

    routes = []

    for feature in features:
        safe_name = sanitize_filename(feature.egenskap) or "unnamed"
        file_path = os.path.join(EXPORT_DIR, f"{safe_name}.json")

        # Use vars() to convert dataclass to dictionary
        feature_dict = clean_dict(vars(feature))

        # Write individual feature JSON
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(feature_dict, f, ensure_ascii=False, indent=2)

        # Append route metadata
        routes.append({
            "file": f"{safe_name}.json",
            "title": feature_dict.get("egenskap", "unnamed")
        })

    # Write routes.json
    with open(ROUTES_FILE, "w", encoding="utf-8") as f:
        json.dump(routes, f, ensure_ascii=False, indent=2)

    print(f"✅ Exported {len(features)} features to '{EXPORT_DIR}'")
    print("📦 routes.json created.")

if __name__ == "__main__":
    export_features_to_json()
