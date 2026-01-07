document.addEventListener('DOMContentLoaded', () => {
  const chatButton = document.getElementById('ai-chat-button');
  const chatContainer = document.getElementById('ai-chat-container');
  const chatClose = document.getElementById('ai-chat-close');
  const chatClear = document.getElementById('ai-chat-clear');
  const chatMessages = document.getElementById('ai-chat-messages');
  const chatInput = document.getElementById('ai-chat-input');
  const chatSend = document.getElementById('ai-chat-send');
  const confirmDialogOverlay = document.getElementById('confirm-dialog-overlay');
  const confirmDialogCancel = document.getElementById('confirm-dialog-cancel');
  const confirmDialogConfirm = document.getElementById('confirm-dialog-confirm');
  const emptyState = document.getElementById('ai-chat-empty-state');

  const API_URL = (window.location.protocol === 'file:' || window.location.hostname === '') 
    ? 'http://localhost:3000/api/chat' 
    : window.location.origin + '/api/chat';

  const STORAGE_KEY = 'ai_chat_history';

  let isOpen = false;
  let isSending = false;
  let messageHistory = [];
  let virtualScrollEnabled = false;
  const VIRTUAL_SCROLL_THRESHOLD = 50;

  function autoResizeTextarea(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen) {
      chatContainer.classList.add('active');
    } else {
      chatContainer.classList.remove('active');
    }
  }

  function saveHistory() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messageHistory));
    } catch (e) {
      console.error('Fehler beim Speichern der Historie:', e);
    }
  }

  function loadHistory() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        messageHistory = JSON.parse(saved);
        return true;
      }
    } catch (e) {
      console.error('Fehler beim Laden der Historie:', e);
    }
    return false;
  }

  function updateEmptyState() {
    const hasMessages = messageHistory.length > 0 && messageHistory.some(msg => msg.content && msg.content.trim());
    if (emptyState) {
      if (hasMessages) {
        emptyState.classList.add('hidden');
      } else {
        emptyState.classList.remove('hidden');
      }
    }
  }

  function clearHistory() {
    messageHistory = [];
    localStorage.removeItem(STORAGE_KEY);
    const rows = chatMessages.querySelectorAll('.ai-chat-row');
    rows.forEach(row => row.remove());
    updateEmptyState();
  }

  function formatText(text) {
    if (!text) return '';
    
    let formatted = text;
    
    formatted = formatted.replace(/\r\n/g, '\n');
    formatted = formatted.replace(/\r/g, '\n');
    
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    
    formatted = formatBold(formatted);
    
    formatted = formatList(formatted);
    
    formatted = formatted.split('\n').map(line => {
      if (line.trim() === '') {
        return '<br>';
      }
      return line;
    }).join('\n');
    
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  }

  function formatBold(text) {
    return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  function formatList(text) {
    const lines = text.split('\n');
    let inList = false;
    let result = [];
    
    for (let line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        if (!inList) {
          result.push('<ul>');
          inList = true;
        }
        const content = trimmed.startsWith('- ') ? trimmed.substring(2) : trimmed.substring(2);
        result.push(`<li>${content}</li>`);
      } else {
        if (inList) {
          result.push('</ul>');
          inList = false;
        }
        result.push(line);
      }
    }
    
    if (inList) result.push('</ul>');
    
    return result.join('\n');
  }

  function linkify(text) {
    const platforms = {
      'twitch.tv': { name: 'Twitch', icon: 'live_tv' },
      'instagram.com': { name: 'Instagram', icon: 'photo_camera' },
      'tiktok.com': { name: 'TikTok', icon: 'music_note' },
      'facebook.com': { name: 'Facebook', icon: 'groups' },
      'spotify.com': { name: 'Spotify', icon: 'library_music' },
      'discord.gg': { name: 'Discord', icon: 'forum' },
      'whatsapp.com': { name: 'WhatsApp', icon: 'chat' },
      'streamelements.com': { name: 'StreamElements', icon: 'paid' }
    };

    const urlRegex = /\b(https?:\/\/[^\s<>"']+)/g;
    return text.replace(urlRegex, (match) => {
      let url = match;
      const trailingPunctuation = /[.,!?;:]+$/;
      const hasTrailingPunct = trailingPunctuation.test(url);
      if (hasTrailingPunct) {
        url = url.replace(trailingPunctuation, '');
      }
      
      if (url.length < 10) {
        return match;
      }
      
      if (!url.includes('.') && !url.includes('/')) {
        return match;
      }
      
      try {
        const urlObj = new URL(url);
        if (!urlObj.hostname || urlObj.hostname.length < 3) {
          return match;
        }

        for (const [domain, info] of Object.entries(platforms)) {
          if (url.includes(domain)) {
            const link = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="ai-platform-link"><span class="material-symbols-outlined">${info.icon}</span><span>${info.name}</span><span class="material-symbols-outlined link-icon">open_in_new</span></a>`;
            return hasTrailingPunct ? link + match.slice(url.length) : link;
          }
        }

        const link = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="ai-chat-link">${url}</a>`;
        return hasTrailingPunct ? link + match.slice(url.length) : link;
      } catch (e) {
        return match;
      }
    });
  }

  function addMessage(content, role, saveToHistory = true) {
    const row = document.createElement('div');
    row.className = `ai-chat-row ${role === 'user' ? 'mine' : 'other'}`;
    
    const avatar = document.createElement('div');
    avatar.className = `ai-chat-avatar ai-chat-avatar-${role === 'user' ? 'user' : 'ai'}`;
    if (role === 'user') {
      avatar.innerHTML = '<span class="material-symbols-outlined">person</span>';
    } else {
      avatar.innerHTML = '<span class="material-symbols-outlined">smart_toy</span>';
    }
    
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'ai-chat-message-wrapper';
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-chat-message ${role === 'user' ? 'mine' : 'other'}`;
    
    if (role === 'assistant') {
      const formattedContent = formatText(content);
      messageDiv.innerHTML = linkify(formattedContent);
    } else {
      messageDiv.textContent = content;
    }
    
    messageWrapper.appendChild(messageDiv);
    
    if (role === 'user') {
      row.appendChild(messageWrapper);
      row.appendChild(avatar);
    } else {
      row.appendChild(avatar);
      row.appendChild(messageWrapper);
    }
    
    chatMessages.appendChild(row);
    
    if (!virtualScrollEnabled) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } else {
      setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 50);
    }

    if (saveToHistory && content.trim()) {
      messageHistory.push({ content, role, timestamp: Date.now() });
      saveHistory();
      
      if (messageHistory.length > VIRTUAL_SCROLL_THRESHOLD && !virtualScrollEnabled) {
        virtualScrollEnabled = true;
        renderHistory();
        setupVirtualScroll();
      }
    }

    updateEmptyState();
    return messageDiv;
  }

  function updateMessage(messageDiv, content) {
    const formattedContent = formatText(content);
    messageDiv.innerHTML = linkify(formattedContent);
    if (!virtualScrollEnabled) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } else {
      const isNearBottom = chatMessages.scrollHeight - chatMessages.scrollTop - chatMessages.clientHeight < 100;
      if (isNearBottom) {
        setTimeout(() => {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 50);
      }
    }
  }

  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message || isSending) return;

    chatInput.value = '';
    autoResizeTextarea(chatInput);
    isSending = true;
    chatSend.disabled = true;

    addMessage(message, 'user');

    const assistantMessageDiv = addMessage('', 'assistant', false);
    assistantMessageDiv.classList.add('typing');
    let fullResponse = '';
    const assistantHistoryIndex = messageHistory.length;
    messageHistory.push({ content: '', role: 'assistant', timestamp: Date.now(), completed: false });
    let lastSaveTime = Date.now();
    const SAVE_INTERVAL = 1000;

    try {
      console.log('Sende Nachricht an:', API_URL);
      const historyForAPI = messageHistory
        .filter(msg => msg.content && msg.content.trim() && msg.completed !== false)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, history: historyForAPI }),
      });
      console.log('Response Status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'API-Anfrage fehlgeschlagen';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (fullResponse === '' && !assistantMessageDiv.textContent) {
            assistantMessageDiv.innerHTML = linkify('Keine Antwort erhalten. Bitte versuchen Sie es erneut.');
            assistantMessageDiv.classList.remove('typing');
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6).trim();
              if (!jsonStr) continue;
              const data = JSON.parse(jsonStr);
              if (data.error) {
                const formattedError = formatText(data.error);
                assistantMessageDiv.innerHTML = linkify(formattedError);
                assistantMessageDiv.classList.remove('typing');
                break;
              }
              if (data.content) {
                fullResponse += data.content;
                updateMessage(assistantMessageDiv, fullResponse);
                if (messageHistory[assistantHistoryIndex]) {
                  messageHistory[assistantHistoryIndex].content = fullResponse;
                  const now = Date.now();
                  if (now - lastSaveTime > SAVE_INTERVAL) {
                    saveHistory();
                    lastSaveTime = now;
                  }
                }
              }
              if (data.done) {
                assistantMessageDiv.classList.remove('typing');
                if (fullResponse === '') {
                  assistantMessageDiv.innerHTML = linkify('Keine Antwort erhalten.');
                }
                break;
              }
            } catch (e) {
              console.error('Parsing-Fehler:', e, 'Line:', line);
            }
          }
        }
      }

      if (buffer.trim()) {
        const remainingLine = buffer.trim();
        if (remainingLine.startsWith('data: ')) {
          try {
            const data = JSON.parse(remainingLine.slice(6).trim());
            if (data.content) {
              fullResponse += data.content;
              updateMessage(assistantMessageDiv, fullResponse);
            }
          } catch (e) {
            console.error('Parsing-Fehler (buffer):', e);
          }
        }
      }

      if (fullResponse === '' && assistantMessageDiv.classList.contains('typing')) {
        assistantMessageDiv.innerHTML = linkify('Keine Antwort erhalten. Bitte versuchen Sie es erneut.');
        assistantMessageDiv.classList.remove('typing');
        messageHistory.pop();
      } else if (fullResponse) {
        if (messageHistory[assistantHistoryIndex]) {
          messageHistory[assistantHistoryIndex].content = fullResponse;
          messageHistory[assistantHistoryIndex].completed = true;
        }
        saveHistory();
      }
      updateEmptyState();
    } catch (error) {
      console.error('Fehler beim Senden der Nachricht:', error);
      const errorMessage = error.message || 'Entschuldigung, ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
      const formattedError = formatText(errorMessage);
      assistantMessageDiv.innerHTML = linkify(formattedError);
      assistantMessageDiv.classList.remove('typing');
      if (messageHistory[assistantHistoryIndex]) {
        messageHistory.pop();
      }
      updateEmptyState();
    } finally {
      isSending = false;
      chatSend.disabled = false;
    }
  }

  function renderHistory() {
    const rows = chatMessages.querySelectorAll('.ai-chat-row');
    rows.forEach(row => row.remove());
    if (messageHistory.length > VIRTUAL_SCROLL_THRESHOLD) {
      virtualScrollEnabled = true;
      renderVirtualScroll();
    } else {
      virtualScrollEnabled = false;
      messageHistory.forEach(msg => {
        if (msg.content && msg.content.trim()) {
          addMessage(msg.content, msg.role, false);
        }
      });
    }
    updateEmptyState();
  }

  function renderVirtualScroll() {
    const container = chatMessages;
    const validMessages = messageHistory.filter(msg => msg.content && msg.content.trim());
    
    if (validMessages.length <= VIRTUAL_SCROLL_THRESHOLD) {
      virtualScrollEnabled = false;
      const rows = container.querySelectorAll('.ai-chat-row');
      rows.forEach(row => row.remove());
      validMessages.forEach(msg => {
        addMessage(msg.content, msg.role, false);
      });
      updateEmptyState();
      return;
    }

    const containerHeight = container.clientHeight || 500;
    const scrollTop = container.scrollTop;
    const estimatedItemHeight = 80;
    const buffer = 5;
    
    const startIndex = Math.max(0, Math.floor(scrollTop / estimatedItemHeight) - buffer);
    const visibleCount = Math.ceil(containerHeight / estimatedItemHeight) + (buffer * 2);
    const endIndex = Math.min(validMessages.length, startIndex + visibleCount);

    const rows = container.querySelectorAll('.ai-chat-row, .virtual-scroll-spacer');
    rows.forEach(row => row.remove());
    
    if (startIndex > 0) {
      const topSpacer = document.createElement('div');
      topSpacer.className = 'virtual-scroll-spacer';
      topSpacer.style.height = `${startIndex * estimatedItemHeight}px`;
      container.appendChild(topSpacer);
    }

    for (let i = startIndex; i < endIndex; i++) {
      const msg = validMessages[i];
      if (msg.content && msg.content.trim()) {
        addMessage(msg.content, msg.role, false);
      }
    }

    if (endIndex < validMessages.length) {
      const bottomSpacer = document.createElement('div');
      bottomSpacer.className = 'virtual-scroll-spacer';
      bottomSpacer.style.height = `${(validMessages.length - endIndex) * estimatedItemHeight}px`;
      container.appendChild(bottomSpacer);
    }
    
    updateEmptyState();
  }

  let scrollTimeout = null;
  function setupVirtualScroll() {
    if (scrollTimeout) {
      chatMessages.removeEventListener('scroll', handleVirtualScroll);
    }
    
    function handleVirtualScroll(e) {
      if (!virtualScrollEnabled) return;
      
      if (e) {
        e.stopPropagation();
      }
      
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      scrollTimeout = setTimeout(() => {
        renderVirtualScroll();
      }, 100);
    }
    
    chatMessages.addEventListener('scroll', handleVirtualScroll, { passive: true });
    
    chatMessages.addEventListener('touchmove', (e) => {
      e.stopPropagation();
    }, { passive: true });
    
    chatMessages.addEventListener('wheel', (e) => {
      e.stopPropagation();
    }, { passive: true });
  }

  function showConfirmDialog(callback) {
    confirmDialogOverlay.classList.add('active');
    const handleConfirm = () => {
      confirmDialogOverlay.classList.remove('active');
      callback();
      cleanup();
    };
    const handleCancel = () => {
      confirmDialogOverlay.classList.remove('active');
      cleanup();
    };
    const handleOverlayClick = (e) => {
      if (e.target === confirmDialogOverlay) {
        handleCancel();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };
    const cleanup = () => {
      confirmDialogConfirm.removeEventListener('click', handleConfirm);
      confirmDialogCancel.removeEventListener('click', handleCancel);
      confirmDialogOverlay.removeEventListener('click', handleOverlayClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
    confirmDialogConfirm.addEventListener('click', handleConfirm);
    confirmDialogCancel.addEventListener('click', handleCancel);
    confirmDialogOverlay.addEventListener('click', handleOverlayClick);
    document.addEventListener('keydown', handleKeyDown);
  }

  chatButton.addEventListener('click', toggleChat);
  chatClose.addEventListener('click', toggleChat);
  chatClear.addEventListener('click', () => {
    showConfirmDialog(() => {
      clearHistory();
    });
  });

  chatSend.addEventListener('click', sendMessage);

  chatInput.addEventListener('input', (e) => {
    autoResizeTextarea(e.target);
  });

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  autoResizeTextarea(chatInput);

  if (loadHistory()) {
    renderHistory();
    if (virtualScrollEnabled) {
      setupVirtualScroll();
      setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 100);
    }
  } else {
    updateEmptyState();
  }

  setupVirtualScroll();

  chatContainer.addEventListener('click', (e) => {
    if (e.target === chatContainer) {
      toggleChat();
    }
  });

  const quickQuestionBtns = document.querySelectorAll('.quick-question-btn');
  quickQuestionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.getAttribute('data-question');
      if (question) {
        chatInput.value = question;
        autoResizeTextarea(chatInput);
        sendMessage();
      }
    });
  });
});
