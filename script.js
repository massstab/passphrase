let wordList = [];

// Automatisches Laden der JSON-Wortliste aus "wordlist.json"
function loadWordListFromServer() {
  fetch("wordlist.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("HTTP-Fehler: " + response.status);
      }
      return response.json();
    })
    .then(data => {
      // Hier gehen wir davon aus, dass die JSON-Datei ein Array mit Wörtern enthält.
      wordList = data;
      console.log("JSON-Wortliste erfolgreich geladen:", wordList);
    })
    .catch(error => {
      console.error("Fehler beim automatischen Laden der JSON-Wortliste:", error);
      document.getElementById('error').textContent = "Fehler: Wortliste konnte nicht automatisch geladen werden! Bitte lade eine Datei hoch.";
    });
}

// Funktion, um die hochgeladene Datei zu verarbeiten (für .txt-Dateien)
function readFile(file) {
  const reader = new FileReader();
  reader.onload = function(event) {
    const content = event.target.result;
    // Bei einer .txt-Datei verarbeiten wir den Inhalt in ein Array von Wörtern:
    wordList = processWordList(content);
    if (wordList.length === 0) {
      document.getElementById('error').textContent = "Fehler: Die Wortliste ist leer!";
    } else {
      document.getElementById('error').textContent = "";
      alert("Wortliste erfolgreich geladen!");
    }
  };
  
  // Fehlerbehandlung
  reader.onerror = function(error) {
    document.getElementById('error').textContent = "Fehler beim Laden der Datei!";
  };
  
  reader.readAsText(file);
}

// Funktion zum Bearbeiten der Wortliste (Aus .txt-Inhalt)
function processWordList(content) {
  return content.trim().toLowerCase().split(/\s+/).filter(word => word.length > 0);
}

// Funktion zum Anwenden der Groß-/Kleinschreibung
function applyCase(word, mode) {
  switch (mode) {
    case "lowercase":
      return word.toLowerCase();
    case "uppercase":
      return word.toUpperCase();
    default:
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
}

// Funktion, um ein zufälliges Sonderzeichen zu erhalten
function getRandomSpecialChar() {
  const specialChars = ['@', '#', '$', '%', '&', '*', '!', '?', '_', '+'];
  return specialChars[Math.floor(Math.random() * specialChars.length)];
}

// Funktion, um eine zufällige Zahl zu generieren
function getRandomNumber() {
  return Math.floor(Math.random() * 10).toString();
}

// Funktion zur Generierung der Passphrase
function generatePassphrase() {
  const numWords = parseInt(document.getElementById('numWords').value, 10);
  const specialCharsEnabled = document.getElementById('specialChars').checked;
  const includeNumbers = document.getElementById('includeNumbers').checked;
  const delimiterInput = document.getElementById('delimiter').value;
  const delimiter = delimiterInput === "" ? "" : delimiterInput;
  const caseStyle = document.getElementById('caseStyle').value;

  if (wordList.length === 0) {
    document.getElementById('error').textContent = "Fehler: Bitte lade zuerst eine Wortliste hoch!";
    return "";
  }

  let passphraseArray = [];
  for (let i = 0; i < numWords; i++) {
    let word = wordList[Math.floor(Math.random() * wordList.length)];
    passphraseArray.push(applyCase(word, caseStyle));
  }

  // Sonderzeichen und Zahlen zufällig hinzufügen, falls aktiviert
  if (specialCharsEnabled || includeNumbers) {
    let indices = [];
    if (specialCharsEnabled && includeNumbers) {
      let index1 = Math.floor(Math.random() * numWords);
      let index2;
      do {
        index2 = Math.floor(Math.random() * numWords);
      } while (index2 === index1);
      indices = [index1, index2];
    } else {
      indices = [Math.floor(Math.random() * numWords)];
    }

    if (specialCharsEnabled && includeNumbers) {
      passphraseArray[indices[0]] += getRandomSpecialChar();
      passphraseArray[indices[1]] += getRandomNumber();
    } else if (specialCharsEnabled) {
      passphraseArray[indices[0]] += getRandomSpecialChar();
    } else if (includeNumbers) {
      passphraseArray[indices[0]] += getRandomNumber();
    }
  }

  document.getElementById('error').textContent = "";
  return passphraseArray.join(delimiter);
}

// Funktion zum Kopieren in die Zwischenablage
function copyToClipboard(text) {
  const successElem = document.getElementById('success');

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function() {
      successElem.innerHTML = "Passphrase erfolgreich in die Zwischenablage kopiert!<br><strong>Achtung!</strong> Die Passphrase befindet sich noch im Zwischenspeicher.";
      setTimeout(function() {
        successElem.innerHTML = "";
      }, 6000);
      showClipboardWarning();
    }, function(err) {
      successElem.textContent = "Fehler beim Kopieren: " + err;
    });
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'Erfolgreich' : 'Fehler';
      successElem.innerHTML = msg + " in Zwischenablage kopiert!<br><strong>Achtung!</strong> Die Passphrase befindet sich noch im Zwischenspeicher.";
      setTimeout(function() {
        successElem.innerHTML = "";
      }, 6000);
      showClipboardWarning();
    } catch (err) {
      successElem.textContent = "Fehler beim Kopieren: " + err;
    }
    document.body.removeChild(textArea);
  }
}

// Funktion zum Anzeigen der Warnung, dass die Passphrase in der Zwischenablage verbleibt
function showClipboardWarning() {
  const warning = document.getElementById("clipboardWarning");
  warning.style.display = "block";
  let visible = true;
  const interval = setInterval(() => {
    warning.style.opacity = visible ? "1" : "0";
    visible = !visible;
  }, 500);
  setTimeout(() => {
    clearInterval(interval);
    warning.style.display = "none";
    warning.style.opacity = "1";
  }, 5000);
}

// Event-Listener für den Datei-Upload (.txt)
document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    readFile(file);
  }
});

// Event-Listener für den "Passphrase generieren"-Button
document.getElementById('generateButton').addEventListener('click', function() {
  const passphrase = generatePassphrase();
  if (passphrase) {
    document.getElementById('passphrase').innerText = passphrase;
  }
});

// Event-Listener für den "In Zwischenablage kopieren"-Button
document.getElementById('copyButton').addEventListener('click', function() {
  const passphrase = document.getElementById('passphrase').innerText;
  if (passphrase) {
    copyToClipboard(passphrase);
  } else {
    alert("Keine Passphrase zum Kopieren vorhanden!");
  }
});

// Beim Laden der Seite versuchen wir, die JSON-Wortliste automatisch zu laden
window.onload = function() {
  loadWordListFromServer();
};
