import json


# 1. Datei einlesen
with open('wordlist_en.txt', 'r', encoding='utf-8') as f:
    content = f.read()


# 2. Verarbeiten mit deiner Funktion
def process_word_list(content):
    return [word for word in content.strip().lower().split() if len(word) > 0]


words = process_word_list(content)


# 3. Als JSON speichern
with open('wordlist_en.json', 'w', encoding='utf-8') as f:
    json.dump(words, f, ensure_ascii=False, indent=2)


print(f'✅ {len(words)} Wörter nach words.json konvertiert!')
print(f'Beispiele: {", ".join(words[:5])}...')