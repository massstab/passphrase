// Eingebettete Standardwortliste (für GitHub Pages)
const embeddedWords = [
  "se", "ami", "amman", "amme", 
  "beispiel", "wort", "liste"
];

let wordList = [];

// Universeller Wortladen
async function loadWordList() {
  const statusEl = document.getElementById('status');
  
  // 1. Versuche Dateiupload
  const fileInput = document.getElementById('fileInput');
  if (fileInput.files.length > 0) {
    const content = await readFile(fileInput.files[0]);
    wordList = processWordList(content);
    statusEl.textContent = `Lokale Wortliste: ${wordList.length} Wörter`;
    return;
  }

  // 2. Versuche JSON von Server
  try {
    const response = await fetch('words.json');
    if (response.ok) {
      wordList = await response.json();
      statusEl.textContent = `Externe Wortliste: ${wordList.length} Wörter`;
      return;
    }
  } catch (e) { /* Ignorieren */ }

  // 3. Fallback: Eingebettete Wörter
  wordList = embeddedWords;
  statusEl.textContent = `Standardwortliste: ${wordList.length} Wörter`;
}

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsText(file);
  });
}

function processWordList(content) {
  return content
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 0);
}

function generatePassphrase() {
  const numWords = parseInt(document.getElementById('numWords').value);
  let result = [];
  
  for (let i = 0; i < numWords; i++) {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    result.push(wordList[randomIndex]);
  }
  
  document.getElementById('passphrase').textContent = result.join('-');
}

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
  loadWordList();
  document.getElementById('generate').addEventListener('click', generatePassphrase);
  document.getElementById('fileInput').addEventListener('change', loadWordList);
});