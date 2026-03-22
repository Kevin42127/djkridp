// 分享功能 - 簡化版本
document.addEventListener('DOMContentLoaded', () => {
  const shareButton = document.getElementById('share-button');
  const shareMenu = document.getElementById('share-menu');
  const shareMenuClose = document.getElementById('share-menu-close');
  const shareMenuOverlay = document.getElementById('share-menu-overlay');
  const shareUrlInput = document.getElementById('share-url-input');
  const shareCopyBtn = document.getElementById('share-copy-btn');

  // 設定當前網址
  function updateShareUrl() {
    const currentUrl = window.location.href;
    if (shareUrlInput) {
      shareUrlInput.value = currentUrl;
    }
  }

  // 打開分享選單
  function openShareMenu() {
    updateShareUrl();
    shareMenu.classList.add('active');
    shareMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // 選中文字
    if (shareUrlInput) {
      shareUrlInput.select();
      shareUrlInput.setSelectionRange(0, shareUrlInput.value.length);
    }
  }

  // 關閉分享選單
  function closeShareMenu() {
    shareMenu.classList.remove('active');
    shareMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // 複製連結功能
  async function copyUrl() {
    try {
      const url = shareUrlInput.value;
      
      // 使用現代 Clipboard API
      await navigator.clipboard.writeText(url);
      
      // 顯示複製成功狀態
      showCopySuccess();
      
      // 重新選中文字
      shareUrlInput.select();
      shareUrlInput.setSelectionRange(0, shareUrlInput.value.length);
      
    } catch (err) {
      // 備用方法
      const textArea = document.createElement('textarea');
      textArea.value = shareUrlInput.value;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      showCopySuccess();
      
      // 重新選中文字
      shareUrlInput.select();
      shareUrlInput.setSelectionRange(0, shareUrlInput.value.length);
    }
  }

  // 顯示複製成功狀態
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

  // 點擊文字框時選中所有文字
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

  // 事件監聽器
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

  // ESC 鍵關閉選單
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && shareMenu.classList.contains('active')) {
      closeShareMenu();
    }
  });

  // Ctrl/Cmd + C 快捷鍵複製
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && shareMenu.classList.contains('active')) {
      e.preventDefault();
      copyUrl();
    }
  });

  // 監聽頁面變化更新網址
  let urlUpdateTimeout;
  window.addEventListener('popstate', () => {
    clearTimeout(urlUpdateTimeout);
    urlUpdateTimeout = setTimeout(updateShareUrl, 100);
  });

  console.log('簡化分享功能已初始化');
});
