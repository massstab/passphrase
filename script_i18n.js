let wordList = [];
let currentLang = 'de';

const translations = {
  de: {
    title: 'Passphrase Generator',
    fileLabel: 'Datei (wortliste.txt):',
    numWordsLabel: 'Anzahl der Wörter:',
    caseLabel: 'Groß-/Kleinschreibung:',
    lowercaseOption: 'Nur Kleinbuchstaben',
    capitalizedOption: 'Erste Groß, Rest klein',
    uppercaseOption: 'Nur Großbuchstaben',
    specialCharsLabel: 'Sonderzeichen einfügen:',
    includeNumbersLabel: 'Zahlen hinzufügen:',
    yesText: 'Ja',
    yesText2: 'Ja',
    delimiterLabel: 'Trennzeichen zwischen Wörtern:',
    generateButton: 'Passphrase generieren',
    copyButton: 'In Zwischenablage kopieren',
    generatedLabel: 'Generierte Passphrase:',
    errorLoadFile: 'Fehler: Bitte lade zuerst eine Wortliste hoch!',
    errorEmptyList: 'Fehler: Die Wortliste ist leer!',
    successCopy: 'Passphrase erfolgreich in die Zwischenablage kopiert!\nAchtung! Die Passphrase befindet sich noch im Zwischenspeicher.',
    clipboardWarning: '⚠️ Die Passphrase könnte weiterhin in der Zwischenablage-Historie gespeichert sein!',
    alertLoad: 'Wortliste erfolgreich geladen!',
    alertCopyEmpty: 'Keine Passphrase zum Kopieren vorhanden!'
  },
  en: {
    title: 'Passphrase Generator',
    fileLabel: 'File (wordlist.txt):',
    numWordsLabel: 'Number of words:',
    caseLabel: 'Case style:',
    lowercaseOption: 'Lowercase only',
    capitalizedOption: 'Capitalize first letter',
    uppercaseOption: 'Uppercase only',
    specialCharsLabel: 'Include special characters:',
    includeNumbersLabel: 'Include numbers:',
    yesText: 'Yes',
    yesText2: 'Yes',
    delimiterLabel: 'Delimiter between words:',
    generateButton: 'Generate Passphrase',
    copyButton: 'Copy to Clipboard',
    generatedLabel: 'Generated Passphrase:',
    errorLoadFile: 'Error: Please upload a word list first!',
    errorEmptyList: 'Error: The word list is empty!',
    successCopy: 'Passphrase successfully copied to clipboard!\nWarning! The passphrase may still be in clipboard history.',
    clipboardWarning: '⚠️ The passphrase may still be stored in clipboard history!',
    alertLoad: 'Word list successfully loaded!',
    alertCopyEmpty: 'No passphrase to copy!'
  }
};

function setLanguage(lang) {
currentLang = lang;
const t = translations[lang];


// Texte setzen
document.getElementById('title').textContent = t.title;
document.getElementById('fileLabel').textContent = t.fileLabel;
document.getElementById('numWordsLabel').textContent = t.numWordsLabel;
document.getElementById('caseLabel').textContent = t.caseLabel;
document.getElementById('lowercaseOption').textContent = t.lowercaseOption;
document.getElementById('capitalizedOption').textContent = t.capitalizedOption;
document.getElementById('uppercaseOption').textContent = t.uppercaseOption;
document.getElementById('specialCharsLabel').textContent = t.specialCharsLabel;
document.getElementById('includeNumbersLabel').textContent = t.includeNumbersLabel;
document.getElementById('yesText').textContent = t.yesText;
document.getElementById('yesText2').textContent = t.yesText2;
document.getElementById('delimiterLabel').textContent = t.delimiterLabel;
document.getElementById('generateButton').textContent = t.generateButton;
document.getElementById('copyButton').textContent = t.copyButton;
document.getElementById('generatedLabel').textContent = t.generatedLabel;
document.getElementById('clipboardWarning').textContent = t.clipboardWarning;


// Wortliste automatisch wechseln
const fileName = (lang === 'de') ? 'wordlist.json' : 'wordlist_en.json';
fetch(fileName)
.then(response => response.json())
.then(data => { wordList = data; })
.catch(error => { document.getElementById('error').textContent = translations[currentLang].errorLoadFile; });
}

function toggleDarkMode() {
document.body.classList.toggle('dark-mode');
document.querySelector('.container').classList.toggle('dark-mode');
document.querySelectorAll('button').forEach(btn => btn.classList.toggle('dark-mode'));
document.querySelectorAll('input, select').forEach(el => el.classList.toggle('dark-mode'));
document.getElementById('passphrase').classList.toggle('dark-mode');
}

// Originale Funktionen für Wortlisten & Passphrase Generator (leicht angepasst)
function loadWordListFromServer() {
  fetch("wordlist.json")
    .then(response => response.json())
    .then(data => { wordList = data; })
    .catch(error => { document.getElementById('error').textContent = translations[currentLang].errorLoadFile; });
}

function readFile(file) {
  const reader = new FileReader();
  reader.onload = function(event) {
    wordList = event.target.result.trim().toLowerCase().split(/\s+/).filter(word => word.length > 0);
    if(wordList.length === 0) document.getElementById('error').textContent = translations[currentLang].errorEmptyList;
    else alert(translations[currentLang].alertLoad);
  };
  reader.readAsText(file);
}

function applyCase(word, mode) { switch(mode) { case 'lowercase': return word.toLowerCase(); case 'uppercase': return word.toUpperCase(); default: return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); } }
function getRandomSpecialChar() { const specialChars = ['@','#','$','%','&','*','!','?','_','+']; return specialChars[Math.floor(Math.random()*specialChars.length)]; }
function getRandomNumber() { return Math.floor(Math.random()*10).toString(); }

function generatePassphrase() {
  const numWords = parseInt(document.getElementById('numWords').value, 10);
  const specialCharsEnabled = document.getElementById('specialChars').checked;
  const includeNumbers = document.getElementById('includeNumbers').checked;
  const delimiter = document.getElementById('delimiter').value || '';
  const caseStyle = document.getElementById('caseStyle').value;

  if(wordList.length === 0){ document.getElementById('error').textContent = translations[currentLang].errorLoadFile; return ''; }

  let passphraseArray = [];
  for(let i=0;i<numWords;i++){ passphraseArray.push(applyCase(wordList[Math.floor(Math.random()*wordList.length)], caseStyle)); }

  if(specialCharsEnabled || includeNumbers){
    let indices=[];
    if(specialCharsEnabled && includeNumbers){ let index1=Math.floor(Math.random()*numWords); let index2; do{ index2=Math.floor(Math.random()*numWords); }while(index2===index1); indices=[index1,index2]; }
    else indices=[Math.floor(Math.random()*numWords)];

    if(specialCharsEnabled && includeNumbers){ passphraseArray[indices[0]]+=getRandomSpecialChar(); passphraseArray[indices[1]]+=getRandomNumber(); }
    else if(specialCharsEnabled) passphraseArray[indices[0]]+=getRandomSpecialChar();
    else if(includeNumbers) passphraseArray[indices[0]]+=getRandomNumber();
  }

  document.getElementById('error').textContent = '';
  return passphraseArray.join(delimiter);
}

function copyToClipboard(text){
  const successElem = document.getElementById('success');
  if(!text){ alert(translations[currentLang].alertCopyEmpty); return; }
  if(navigator.clipboard){
    navigator.clipboard.writeText(text).then(()=>{
      successElem.textContent = translations[currentLang].successCopy;
      showClipboardWarning();
      setTimeout(()=>{successElem.textContent='';},6000);
    });
  } else {
    const textArea=document.createElement('textarea');
    textArea.value=text;
    document.body.appendChild(textArea);
    textArea.select();
    try{ document.execCommand('copy'); successElem.textContent = translations[currentLang].successCopy; showClipboardWarning(); setTimeout(()=>{successElem.textContent='';},6000); }
    finally{ document.body.removeChild(textArea); }
  }
}

function showClipboardWarning(){
  const warning = document.getElementById('clipboardWarning');
  warning.style.display='block';
  let visible=true;
  const interval=setInterval(()=>{ warning.style.opacity=visible?'1':'0'; visible=!visible; },500);
  setTimeout(()=>{ clearInterval(interval); warning.style.display='none'; warning.style.opacity='1'; },5000);
}

// Event Listener
document.getElementById('fileInput').addEventListener('change', e => { if(e.target.files[0]) readFile(e.target.files[0]); });
document.getElementById('generateButton').addEventListener('click', () => { const pass = generatePassphrase(); if(pass) document.getElementById('passphrase').innerText = pass; });
document.getElementById('copyButton').addEventListener('click', () => { copyToClipboard(document.getElementById('passphrase').innerText); });
document.getElementById('langDeButton').addEventListener('click', () => setLanguage('de'));
document.getElementById('langEnButton').addEventListener('click', () => setLanguage('en'));
document.getElementById('darkModeButton').addEventListener('click', toggleDarkMode);


window.onload = function() { setLanguage('de'); };