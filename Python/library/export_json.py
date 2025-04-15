import os
import json
import shutil
from entity_reader import load_features, PATH, SHEET_NAME
import math

# Folder to store the individual feature JSON files
EXPORT_DIR = "resource json"

##Cleaning def 
def clean_dict(d):
    """Replace NaN values with a placeholder string."""
    return {
        k: ("Inget innehåll" if isinstance(v, float) and math.isnan(v) else v)
        for k, v in d.items()
    }
    
    



def sanitize_filename(name: str) -> str:
    """Make filename safe for file systems."""
    return "".join(c for c in name if c.isalnum() or c in (' ', '_', '-')).strip()

def export_features_to_json():
    # 1. Load the features
    features = load_features(PATH, SHEET_NAME)

    # 2. Prepare output directory
    if os.path.exists(EXPORT_DIR):
        shutil.rmtree(EXPORT_DIR)  # Remove everything in the folder
    os.makedirs(EXPORT_DIR)

    # 3. Create a separate JSON file for each feature
# 3. Create a separate JSON file for each feature
    for feature in features:
        safe_name = sanitize_filename(feature.egenskap) or "unnamed"
        file_path = os.path.join(EXPORT_DIR, f"{safe_name}.json")
    
        feature_dict = clean_dict(feature.__dict__)  # <- clean here

        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(feature_dict, f, ensure_ascii=False, indent=2)


    print(f"✅ Exported {len(features)} features to folder: {EXPORT_DIR}")

if __name__ == "__main__":
    export_features_to_json()
