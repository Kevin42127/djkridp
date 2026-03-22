// 強制隱藏滾動條軌道但保留手柄
document.addEventListener('DOMContentLoaded', () => {
  // 創建強制隱藏軌道但保留手柄的樣式
  const forceHideTrackKeepThumbStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      /* 強制隱藏軌道但保留手柄 - 最高優先級 */
      ::-webkit-scrollbar {
        width: 8px !important;
        height: 8px !important;
        background: transparent !important;
      }
      
      ::-webkit-scrollbar-track {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        outline: none !important;
        -webkit-appearance: none !important;
        appearance: none !important;
        color: transparent !important;
        visibility: hidden !important;
      }
      
      ::-webkit-scrollbar-track-piece {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        outline: none !important;
        -webkit-appearance: none !important;
        appearance: none !important;
        color: transparent !important;
        visibility: hidden !important;
      }
      
      ::-webkit-scrollbar-track-piece:start,
      ::-webkit-scrollbar-track-piece:end {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        outline: none !important;
        -webkit-appearance: none !important;
        appearance: none !important;
        color: transparent !important;
        visibility: hidden !important;
      }
      
      ::-webkit-scrollbar-corner {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        outline: none !important;
        color: transparent !important;
        visibility: hidden !important;
      }
      
      ::-webkit-scrollbar-button {
        background: transparent !important;
        height: 0 !important;
        width: 0 !important;
        display: none !important;
        visibility: hidden !important;
        border: none !important;
      }
      
      /* 保留滾動條手柄 - 強制可見 */
      ::-webkit-scrollbar-thumb {
        background: var(--color-purple-primary) !important;
        border-radius: 4px !important;
        border: none !important;
        outline: none !important;
        transition: all 0.3s ease !important;
        -webkit-appearance: none !important;
        appearance: none !important;
        visibility: visible !important;
        display: block !important;
        opacity: 1 !important;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: var(--color-purple-dark) !important;
      }
      
      ::-webkit-scrollbar-thumb:active {
        background: var(--color-purple-darker) !important;
      }
      
      /* 所有 Webkit 元素 - 強制隱藏軌道 */
      *::-webkit-scrollbar-track {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        outline: none !important;
        -webkit-appearance: none !important;
        appearance: none !important;
        color: transparent !important;
        visibility: hidden !important;
      }
      
      *::-webkit-scrollbar-track-piece {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        outline: none !important;
        -webkit-appearance: none !important;
        appearance: none !important;
        color: transparent !important;
        visibility: hidden !important;
      }
      
      /* Firefox - 隱藏軌道但保留手柄 */
      html {
        scrollbar-width: thin !important;
        scrollbar-color: var(--color-purple-primary) transparent !important;
      }
      
      /* 針對特定元素的強制隱藏 */
      body::-webkit-scrollbar-track {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        outline: none !important;
        -webkit-appearance: none !important;
        appearance: none !important;
        color: transparent !important;
        visibility: hidden !important;
      }
      
      main::-webkit-scrollbar-track {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        outline: none !important;
        -webkit-appearance: none !important;
        appearance: none !important;
        color: transparent !important;
        visibility: hidden !important;
      }
      
      section::-webkit-scrollbar-track {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        outline: none !important;
        -webkit-appearance: none !important;
        appearance: none !important;
        color: transparent !important;
        visibility: hidden !important;
      }
      
      div::-webkit-scrollbar-track {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        outline: none !important;
        -webkit-appearance: none !important;
        appearance: none !important;
        color: transparent !important;
        visibility: hidden !important;
      }
      
      /* 確保滾動功能正常 */
      body {
        overflow-y: auto !important;
        overflow-x: hidden !important;
      }
      
      html {
        overflow-y: auto !important;
        overflow-x: hidden !important;
      }
      
      /* 響應式調整 */
      @media (max-width: 768px) {
        ::-webkit-scrollbar {
          width: 4px !important;
          height: 4px !important;
        }
        
        ::-webkit-scrollbar-thumb {
          border-radius: 2px !important;
        }
      }
    `;
    
    // 添加到 head 的最前面，確保最高優先級
    document.head.insertBefore(style, document.head.firstChild);
  };

  // 立即執行
  forceHideTrackKeepThumbStyles();

  // 多次延遲執行，確保覆蓋所有其他樣式
  setTimeout(forceHideTrackKeepThumbStyles, 50);
  setTimeout(forceHideTrackKeepThumbStyles, 100);
  setTimeout(forceHideTrackKeepThumbStyles, 200);
  setTimeout(forceHideTrackKeepThumbStyles, 500);
  
  // 監聽 DOM 變化
  const observer = new MutationObserver(() => {
    forceHideTrackKeepThumbStyles();
  });
  
  observer.observe(document.head, {
    childList: true,
    subtree: true
  });

  // 監聽滾動事件確保功能正常
  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      isScrolling = true;
      // 滾動功能正常
      setTimeout(() => {
        isScrolling = false;
      }, 100);
    }
  });

  // 定期檢查並重新應用樣式
  setInterval(() => {
    forceHideTrackKeepThumbStyles();
  }, 1000);

  console.log('強制滾動條軌道隱藏腳本已載入，手柄保留');
});
