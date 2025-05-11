import tkinter as tk
from tkinter import filedialog
import os

SETTINGS_PATH = os.path.join("Python", "Resource folder", "settings.txt")

def get_settings():
    if not os.path.exists(SETTINGS_PATH):
        # No settings file, ask user and create one
        root = tk.Tk()
        root.withdraw()
        file_path = filedialog.askopenfilename(title="Select Excel file", filetypes=[("Excel files", "*.xlsx")])
        if not file_path:
            raise Exception("No file selected.")
        
        sheet_name = input("Enter the sheet name (or press Enter if there's only one): ").strip()
        if not sheet_name:
            sheet_name = "Entity"  # Default fallback

        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(SETTINGS_PATH), exist_ok=True)
        
        # Save settings
        with open(SETTINGS_PATH, "w", encoding="utf-8") as f:
            f.write("# Settings for Excel processing\n")
            f.write(f"excel_file={file_path}\n")
            f.write(f"sheet_name={sheet_name}\n")

        return file_path, sheet_name

    else:
        excel_file = ""
        sheet_name = ""
        with open(SETTINGS_PATH, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if line.startswith("excel_file="):
                    excel_file = line.split("=", 1)[1]
                elif line.startswith("sheet_name="):
                    sheet_name = line.split("=", 1)[1]
        return excel_file, sheet_name


if __name__ == "__main__":
    path, sheet = get_settings()
    print("✅ Excel Path:", path)
    print("📄 Sheet Name:", sheet)
