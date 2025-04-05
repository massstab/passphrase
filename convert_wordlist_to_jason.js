const fs = require('fs');
const path = require('path');

// 1. Datei einlesen
const input = fs.readFileSync(path.join(__dirname, 'wortliste.txt'), 'utf8');

// 2. Verarbeiten mit DEINER Funktion
function processWordList(content) {
  return content
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 0);
}

const words = processWordList(input);

// 3. Als JSON speichern
fs.writeFileSync(
  'words.json',
  JSON.stringify(words, null, 2) // Schön formatiert
);

console.log(`✅ ${words.length} Wörter nach words.json konvertiert!`);
console.log(`Beispiele: ${words.slice(0, 5).join(', ')}...`);