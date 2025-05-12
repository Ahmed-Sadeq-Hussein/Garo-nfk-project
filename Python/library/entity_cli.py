import os
import readchar
from entity_reader import load_features, Feature, PATH, SHEET_NAME  # Reuse constants

# Display list of all feature names. This is used for debugging purposes only
def list_egenskaper(features):
    print("\n=== Lista av Egenskaper ===")
    for i, f in enumerate(features):
        print(f"{i+1}. {f.egenskap.strip()}")
    print("\nSkriv en siffra eller ett namn för att visa detaljer.")
    print("Skriv 'exit' för att avsluta.\n")

def feature_viewer(feature: Feature):
    attributes = [
        ("Kundfördel", feature.fordel),
        ("Tänkbar Nytta", feature.nytta),
        ("Tänkbara Problem", feature.problem),
        ("Anledning till att ha", feature.anledning),
        ("Värde", feature.cost),
        ("Beskrivning", feature.beskrivning)
    ]
    index = 0
    while True:
        os.system('cls' if os.name == 'nt' else 'clear')
        print(f"--- {feature.egenskap.strip()} ---")
        print(f"{attributes[index][0]}: {attributes[index][1]}")
        print("\nTryck ← eller → för att bläddra, '1' för att återgå.")
        key = readchar.readkey()
        if key == readchar.key.RIGHT:
            index = (index + 1) % len(attributes)
        elif key == readchar.key.LEFT:
            index = (index - 1) % len(attributes)
        elif key == '1':
            break

def main():
    features = load_features(PATH, SHEET_NAME)
    while True:
        os.system('cls' if os.name == 'nt' else 'clear')
        list_egenskaper(features)
        selection = input("Ditt val: ").strip()

        if selection.lower() == 'exit':
            break

        #Case: User typed a number
        if selection.isdigit():
            index = int(selection) - 1
            if 0 <= index < len(features):
                feature_viewer(features[index])
            else:
                print(" Ogiltigt nummer. Tryck enter för att försöka igen.")
                input()
            continue

        # 🔠 Case: User typed part of a name
        matches = [
            f for f in features 
            if selection.lower() in f.egenskap.strip().lower()
        ]

        if len(matches) == 1:
            feature_viewer(matches[0])
        elif len(matches) > 1:
            print("⚠️ Flera matchande egenskaper:")
            for f in matches:
                print("-", f.egenskap.strip())
            input("\nTryck enter för att välja igen.")
        else:
            print("❌ Ingen matchning. Tryck enter för att försöka igen.")
            input()

if __name__ == "__main__":
    main()