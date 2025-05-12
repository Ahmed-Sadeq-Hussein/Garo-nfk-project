import os
import json
import shutil
import math
from collections import defaultdict
from entity_reader import load_features, PATH, SHEET_NAME, TAG_COLUMNS
## config
EXPORT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "resource json"))
ROUTES_FILE = os.path.join(EXPORT_DIR, "routes.json")
TAG_COUNTS_FILE = os.path.join(EXPORT_DIR, "tagCounts.json")

# Mapping tag display name to feature attribute name
TAG_COLUMN_MAPPING = {
    "Garo": "Garo",
    "Säkerhet": "Säkerhet",
    "Driftsäkerhet": "Driftsäkerhet",
    "Installation": "Installation",
    "användarvänligt": "användarvänligt",
    "Smarta funktioner": "Smartafunktioner",
    "Ekonomi": "Ekonomi"
}
##Deleting contents not required.
def clean_dict(d):
    return {
        k: ("Inget innehåll" if isinstance(v, float) and math.isnan(v) else v)
        for k, v in d.items()
    }

def sanitize_filename(name: str) -> str:
    return "".join(c for c in name if c.isalnum() or c in (' ', '_', '-')).strip()

def export_features_to_json():
    features = load_features(PATH, SHEET_NAME)

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
