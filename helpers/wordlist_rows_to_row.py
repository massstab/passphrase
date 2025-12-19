# Datei einlesen
with open('wordlist_en.txt', 'r', encoding='utf-8') as f:
    words = [line.strip() for line in f if line.strip() != '']

# Wörter in eine Zeile mit Leerzeichen zusammenfügen
one_line = ' '.join(words)

# Ergebnis speichern
with open('wordlist_en.txt', 'w', encoding='utf-8') as f:
    f.write(one_line)

print('wordlist_en.txt wurde erstellt.')