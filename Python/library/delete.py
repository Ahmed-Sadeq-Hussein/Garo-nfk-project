import shutil
import os

# Define relative paths from this script's location
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../'))
GENERATED_DIR = os.path.join(BASE_DIR, 'Front_end', 'info-page', 'src', 'generated')
RESOURCE_JSON_DIR = os.path.join(BASE_DIR, 'resource json')

def remove_folder(path, name):
    if os.path.exists(path):
        shutil.rmtree(path)
        print(f"✅ Deleted '{name}' folder.")
    else:
        print(f"ℹ️ '{name}' folder does not exist, skipping.")

if __name__ == "__main__":
    remove_folder(GENERATED_DIR, 'generated')
    remove_folder(RESOURCE_JSON_DIR, 'resource json')
