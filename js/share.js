// Teilen-Funktion - vereinfachte Version
document.addEventListener('DOMContentLoaded', () => {
  const shareButton = document.getElementById('share-button');
  const shareMenu = document.getElementById('share-menu');
  const shareMenuClose = document.getElementById('share-menu-close');
  const shareMenuOverlay = document.getElementById('share-menu-overlay');
  const shareUrlInput = document.getElementById('share-url-input');
  const shareCopyBtn = document.getElementById('share-copy-btn');

  // Aktuelle URL festlegen
  function updateShareUrl() {
    const currentUrl = window.location.href;
    if (shareUrlInput) {
      shareUrlInput.value = currentUrl;
    }
  }

  // Teilen-Menü öffnen
  function openShareMenu() {
    updateShareUrl();
    shareMenu.classList.add('active');
    shareMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Text auswählen
    if (shareUrlInput) {
      shareUrlInput.select();
      shareUrlInput.setSelectionRange(0, shareUrlInput.value.length);
    }
  }

  // Teilen-Menü schließen
  function closeShareMenu() {
    shareMenu.classList.remove('active');
    shareMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Link-Kopierfunktion
  async function copyUrl() {
    try {
      const url = shareUrlInput.value;
      
      // Moderne Clipboard API verwenden
      await navigator.clipboard.writeText(url);
      
      // Kopier-Erfolg anzeigen
      showCopySuccess();
      
      // Text erneut auswählen
      shareUrlInput.select();
      shareUrlInput.setSelectionRange(0, shareUrlInput.value.length);
      
    } catch (err) {
      // Backup-Methode
      const textArea = document.createElement('textarea');
      textArea.value = shareUrlInput.value;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      showCopySuccess();
      
      // Text erneut auswählen
      shareUrlInput.select();
      shareUrlInput.setSelectionRange(0, shareUrlInput.value.length);
    }
  }

  // Kopier-Erfolg anzeigen
  function showCopySuccess() {
    if (shareCopyBtn) {
      shareCopyBtn.classList.add('copied');
      const originalText = shareCopyBtn.querySelector('span:last-child').textContent;
      shareCopyBtn.querySelector('span:last-child').textContent = 'Kopiert!';
      
      setTimeout(() => {
        shareCopyBtn.classList.remove('copied');
        shareCopyBtn.querySelector('span:last-child').textContent = originalText;
      }, 2000);
    }
  }

  // Bei Klick auf Textfeld gesamten Text auswählen
  if (shareUrlInput) {
    shareUrlInput.addEventListener('click', () => {
      shareUrlInput.select();
      shareUrlInput.setSelectionRange(0, shareUrlInput.value.length);
    });
    
    shareUrlInput.addEventListener('focus', () => {
      shareUrlInput.select();
      shareUrlInput.setSelectionRange(0, shareUrlInput.value.length);
    });
  }

  // Event-Listener
  if (shareButton) {
    shareButton.addEventListener('click', (e) => {
      e.preventDefault();
      openShareMenu();
    });
  }

  if (shareMenuClose) {
    shareMenuClose.addEventListener('click', closeShareMenu);
  }

  if (shareMenuOverlay) {
    shareMenuOverlay.addEventListener('click', closeShareMenu);
  }

  if (shareCopyBtn) {
    shareCopyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      copyUrl();
    });
  }

  // ESC-Taste schließt Menü
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && shareMenu.classList.contains('active')) {
      closeShareMenu();
    }
  });

  // Ctrl/Cmd + C Shortcut zum Kopieren
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && shareMenu.classList.contains('active')) {
      e.preventDefault();
      copyUrl();
    }
  });

  // Seitenänderungen überwachen und URL aktualisieren
  let urlUpdateTimeout;
  window.addEventListener('popstate', () => {
    clearTimeout(urlUpdateTimeout);
    urlUpdateTimeout = setTimeout(updateShareUrl, 100);
  });

  console.log('Vereinfachte Teilen-Funktion initialisiert');
});
