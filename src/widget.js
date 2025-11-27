import { io } from 'socket.io-client';
import './widget.css';

class AISupportWidget {
  constructor(config) {
    this.config = {
      // API Configuration
      apiKey: config.apiKey,
      apiUrl: config.apiUrl || 'http://localhost:3000',
      wsUrl: config.wsUrl || 'http://localhost:3000',
      userName: config.userName || 'Guest',
      
      // Colors
      primaryColor: config.primaryColor || '#4F46E5',
      secondaryColor: config.secondaryColor || '#FFFFFF',
      textColor: config.textColor || '#1F2937',
      botMessageBg: config.botMessageBg || '#F3F4F6',
      userMessageBg: config.userMessageBg || '#4F46E5',
      userMessageText: config.userMessageText || '#FFFFFF',
      
      // Positioning
      position: config.position || 'bottom-right',
      offsetX: config.offsetX || '20px',
      offsetY: config.offsetY || '20px',
      
      // Sizing
      widgetWidth: config.widgetWidth || '380px',
      widgetHeight: config.widgetHeight || '600px',
      buttonSize: config.buttonSize || '60px',
      
      // Typography
      fontFamily: config.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: config.fontSize || '14px',
      
      // Border Radius
      borderRadius: config.borderRadius || '12px',
      buttonRadius: config.buttonRadius || '50%',
      messageBubbleRadius: config.messageBubbleRadius || '12px',
      
      // Text & Messages
      welcomeMessage: config.welcomeMessage || 'Здравствуйте! Чем могу помочь?',
      buttonText: config.buttonText || 'Поддержка',
      placeholderText: config.placeholderText || 'Напишите сообщение...',
      headerTitle: config.headerTitle || 'Поддержка',
      headerSubtitle: config.headerSubtitle || 'Онлайн',
      
      // Icons & Avatar
      botAvatar: config.botAvatar || null,
      userAvatar: config.userAvatar || null,
      
      // Animations
      enableAnimations: config.enableAnimations !== false,
      
      // Features
      showTimestamp: config.showTimestamp !== false,
      showAvatar: config.showAvatar !== false,
      enableSound: config.enableSound || false,
      
      // Z-index
      zIndex: config.zIndex || 999999,
      
      // Headless mode - hide built-in toggle button
      headless: config.headless || false
    };

    this.chatId = this.generateChatId();
    this.isOpen = false;
    this.isInitialized = false;
    this.messages = [];
    this.socket = null;
    this.boundTriggers = [];

    this.init();
  }

  generateChatId() {
    const stored = localStorage.getItem('aisup_chat_id');
    if (stored) return stored;
    
    const newId = `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('aisup_chat_id', newId);
    return newId;
  }

  init() {
    this.injectStyles();
    this.createWidget();
    this.connectWebSocket();
  }

  injectStyles() {
    const root = document.documentElement;
    
    // Colors
    root.style.setProperty('--aisup-primary', this.config.primaryColor);
    root.style.setProperty('--aisup-secondary', this.config.secondaryColor);
    root.style.setProperty('--aisup-text', this.config.textColor);
    root.style.setProperty('--aisup-bot-message-bg', this.config.botMessageBg);
    root.style.setProperty('--aisup-user-message-bg', this.config.userMessageBg);
    root.style.setProperty('--aisup-user-message-text', this.config.userMessageText);
    
    // Sizing
    root.style.setProperty('--aisup-widget-width', this.config.widgetWidth);
    root.style.setProperty('--aisup-widget-height', this.config.widgetHeight);
    root.style.setProperty('--aisup-button-size', this.config.buttonSize);
    
    // Typography
    root.style.setProperty('--aisup-font-family', this.config.fontFamily);
    root.style.setProperty('--aisup-font-size', this.config.fontSize);
    
    // Border Radius
    root.style.setProperty('--aisup-radius', this.config.borderRadius);
    root.style.setProperty('--aisup-button-radius', this.config.buttonRadius);
    root.style.setProperty('--aisup-bubble-radius', this.config.messageBubbleRadius);
    
    // Positioning
    root.style.setProperty('--aisup-offset-x', this.config.offsetX);
    root.style.setProperty('--aisup-offset-y', this.config.offsetY);
    
    // Z-index
    root.style.setProperty('--aisup-z-index', this.config.zIndex);
    
    // Animations
    if (!this.config.enableAnimations) {
      root.style.setProperty('--aisup-transition', 'none');
    }
  }

  createWidget() {
    // Create container
    this.container = document.createElement('div');
    this.container.className = `aisup-widget aisup-${this.config.position}`;
    
    // Toggle button visibility based on headless mode
    const toggleBtnStyle = this.config.headless ? 'display: none;' : '';
    
    this.container.innerHTML = `
      <button class="aisup-toggle-btn" id="aisup-toggle" style="${toggleBtnStyle}">
        <svg class="aisup-icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <svg class="aisup-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        <span class="aisup-notification-badge" id="aisup-badge" style="display: none;">0</span>
      </button>

      <div class="aisup-chat-window" id="aisup-window">
        <div class="aisup-chat-header">
          <div class="aisup-header-info">
            <div class="aisup-status-indicator"></div>
            <div>
              <div class="aisup-header-title">${this.config.headerTitle}</div>
              <div class="aisup-header-subtitle">${this.config.headerSubtitle}</div>
            </div>
          </div>
          <button class="aisup-close-btn" id="aisup-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="aisup-messages" id="aisup-messages">
          <div class="aisup-loading" id="aisup-loading">
            <div class="aisup-spinner"></div>
            <div>Инициализация чата...</div>
          </div>
        </div>

        <div class="aisup-input-area">
          <div class="aisup-typing-indicator" id="aisup-typing" style="display: none;">
            <span></span><span></span><span></span>
          </div>
          <div class="aisup-input-wrapper">
            <input 
              type="file" 
              id="aisup-file-input" 
              accept="image/*,video/*,.pdf,.doc,.docx,.txt" 
              style="display: none;"
            />
            <button class="aisup-attach-btn" id="aisup-attach" title="Прикрепить файл" disabled>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
            </button>
            <input 
              type="text" 
              id="aisup-input" 
              placeholder="${this.config.placeholderText}" 
              disabled
            />
            <button class="aisup-send-btn" id="aisup-send" disabled>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.container);
    this.attachEventListeners();
  }

  attachEventListeners() {
    const toggleBtn = document.getElementById('aisup-toggle');
    const closeBtn = document.getElementById('aisup-close');
    const sendBtn = document.getElementById('aisup-send');
    const input = document.getElementById('aisup-input');
    const attachBtn = document.getElementById('aisup-attach');
    const fileInput = document.getElementById('aisup-file-input');

    toggleBtn.addEventListener('click', () => this.toggle());
    closeBtn.addEventListener('click', () => this.close());
    sendBtn.addEventListener('click', () => this.sendMessage());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // File attachment
    attachBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
  }

  async connectWebSocket() {
    try {
      this.socket = io(this.config.wsUrl, {
        auth: { apiKey: this.config.apiKey }
      });

      this.socket.on('connect', () => {
        console.log('[AISup] WebSocket connected');
        this.initializeChat();
      });

      this.socket.on('connect_error', (error) => {
        console.error('[AISup] Connection error:', error);
        this.showError('Ошибка подключения. Пожалуйста, обновите страницу.');
      });

      this.socket.on('message_added', ({ chatId, message }) => {
        console.log('[AISup] message_added event:', { 
          receivedChatId: chatId, 
          expectedChatId: this.mongoChatId, 
          messageRole: message.role,
          messageType: message.type,
          match: chatId === this.mongoChatId
        });
        
        if (chatId === this.mongoChatId && message.role !== 'user') {
          console.log('[AISup] Adding bot message to UI');
          
          // Check message type
          if (message.type === 'photo' || message.type === 'file' || message.type === 'video') {
            this.addFileMessage({ 
              url: message.content, 
              type: message.type, 
              caption: message.caption 
            }, 'bot');
          } else {
            this.addMessage(message.content, 'bot');
          }
          
          this.hideTyping();
          if (!this.isOpen) {
            this.showNotification();
          }
        }
      });

      this.socket.on('chat_updated', ({ chat }) => {
        if (chat.mode === 'operator') {
          this.showSystemMessage('Оператор подключился к чату');
        }
      });
    } catch (error) {
      console.error('[AISup] Socket init error:', error);
    }
  }

  async initializeChat() {
    try {
      const response = await fetch(`${this.config.apiUrl}/api/integration/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey
        },
        body: JSON.stringify({
          chatId: this.chatId,
          chatNickname: this.config.userName
        })
      });

      const data = await response.json();
      
      if (data.response === 'success') {
        this.isInitialized = true;
        
        // Save MongoDB chat ID for WebSocket events (from backend response)
        this.mongoChatId = data.data.chatId;
        console.log('[AISup] MongoDB chat ID:', this.mongoChatId);
        console.log('[AISup] Widget chat ID:', this.chatId);
        
        // Join socket room using widget's chatId (not MongoDB _id)
        this.socket.emit('integration_join', { chatId: this.chatId }, (response) => {
          console.log('[AISup] integration_join response:', response);
          if (response.status === 'ok') {
            // Update mongoChatId with the actual MongoDB _id from backend
            if (response.chatId) {
              this.mongoChatId = response.chatId;
              console.log('[AISup] Updated MongoDB chat ID from join:', this.mongoChatId);
            }
            console.log('[AISup] Successfully joined chat room for:', this.chatId);
          } else {
            console.error('[AISup] Failed to join chat room:', response.message);
          }
        });

        // Load existing messages
        await this.loadMessages();

        // Add welcome message if no messages
        if (this.messages.length === 0 && data.data.startMessage) {
          this.addMessage(data.data.startMessage, 'bot');
        }

        // Enable input
        document.getElementById('aisup-input').disabled = false;
        document.getElementById('aisup-send').disabled = false;
        document.getElementById('aisup-attach').disabled = false;
        
        this.hideLoading();
      }
    } catch (error) {
      console.error('[AISup] Init error:', error);
      this.showError('Не удалось инициализировать чат');
    }
  }

  async loadMessages() {
    try {
      const response = await fetch(`${this.config.apiUrl}/api/integration/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey
        },
        body: JSON.stringify({ chatId: this.chatId })
      });

      const data = await response.json();
      
      if (data.response === 'success' && data.data.length > 0) {
        this.messages = data.data;
        data.data.forEach(msg => {
          if (msg.type === 'photo' || msg.type === 'file' || msg.type === 'video') {
            this.addFileMessage({ url: msg.content, type: msg.type, caption: msg.caption }, msg.role, false);
          } else {
            this.addMessage(msg.content, msg.role, false);
          }
        });
      }
    } catch (error) {
      console.error('[AISup] Load messages error:', error);
    }
  }

  async sendMessage() {
    const input = document.getElementById('aisup-input');
    const text = input.value.trim();
    
    if (!text || !this.isInitialized) return;

    // Add user message to UI
    this.addMessage(text, 'user');
    input.value = '';
    this.showTyping();

    try {
      const response = await fetch(`${this.config.apiUrl}/api/integration/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey
        },
        body: JSON.stringify({
          chatId: this.chatId,
          messageText: text
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Bot response will come via WebSocket
    } catch (error) {
      console.error('[AISup] Send error:', error);
      this.hideTyping();
      this.showError('Не удалось отправить сообщение');
    }
  }

  handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      this.showError('Файл слишком большой. Максимум 10 МБ');
      event.target.value = '';
      return;
    }

    this.sendFile(file);
    event.target.value = ''; // Reset input
  }

  async sendFile(file) {
    if (!this.isInitialized) return;

    // Show file as "uploading" message
    this.addFileMessage(file, 'user', true);
    this.showTyping();

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('chatId', this.chatId);

      const response = await fetch(`${this.config.apiUrl}/api/integration/send-file`, {
        method: 'POST',
        headers: {
          'X-API-Key': this.config.apiKey
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      console.log('[AISup] File uploaded:', data);

      // Bot response will come via WebSocket
    } catch (error) {
      console.error('[AISup] File upload error:', error);
      this.hideTyping();
      this.showError('Не удалось загрузить файл');
    }
  }

  addMessage(text, role, scroll = true) {
    const messagesContainer = document.getElementById('aisup-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `aisup-message aisup-message-${role}`;
    
    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
      <div class="aisup-message-content">
        <div class="aisup-message-text">${this.escapeHtml(text)}</div>
        <div class="aisup-message-time">${time}</div>
      </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    
    if (scroll) {
      this.scrollToBottom();
    }
  }

  addFileMessage(fileData, role, uploading = false) {
    const messagesContainer = document.getElementById('aisup-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `aisup-message aisup-message-${role}`;
    
    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    
    let content = '';
    
    if (uploading) {
      // Show upload progress
      const fileName = fileData.name || 'file';
      const fileSize = this.formatFileSize(fileData.size || 0);
      content = `
        <div class="aisup-file-message">
          <div class="aisup-file-icon">📎</div>
          <div class="aisup-file-info">
            <div class="aisup-file-name">${this.escapeHtml(fileName)}</div>
            <div class="aisup-file-size">${fileSize} • Загрузка...</div>
          </div>
        </div>
      `;
    } else if (fileData.type === 'photo' && fileData.url) {
      // Show image
      content = `
        <div class="aisup-image-message">
          <img src="${fileData.url}" alt="Image" onclick="window.open('${fileData.url}', '_blank')" />
          ${fileData.caption ? `<div class="aisup-image-caption">${this.escapeHtml(fileData.caption)}</div>` : ''}
        </div>
      `;
    } else if (fileData.type === 'video' && fileData.url) {
      // Show video
      content = `
        <div class="aisup-video-message">
          <video controls src="${fileData.url}"></video>
          ${fileData.caption ? `<div class="aisup-image-caption">${this.escapeHtml(fileData.caption)}</div>` : ''}
        </div>
      `;
    } else if (fileData.url) {
      // Show file link
      const fileName = fileData.url.split('/').pop() || 'file';
      content = `
        <div class="aisup-file-message">
          <a href="${fileData.url}" target="_blank" class="aisup-file-link">
            <div class="aisup-file-icon">📄</div>
            <div class="aisup-file-info">
              <div class="aisup-file-name">${this.escapeHtml(fileName)}</div>
              <div class="aisup-file-action">Открыть файл</div>
            </div>
          </a>
        </div>
      `;
    }
    
    messageDiv.innerHTML = `
      <div class="aisup-message-content">
        ${content}
        <div class="aisup-message-time">${time}</div>
      </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  showSystemMessage(text) {
    const messagesContainer = document.getElementById('aisup-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'aisup-message-system';
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  showError(text) {
    this.hideLoading();
    this.showSystemMessage(`❌ ${text}`);
  }

  showTyping() {
    document.getElementById('aisup-typing').style.display = 'flex';
  }

  hideTyping() {
    document.getElementById('aisup-typing').style.display = 'none';
  }

  showNotification() {
    const badge = document.getElementById('aisup-badge');
    const currentCount = parseInt(badge.textContent) || 0;
    badge.textContent = currentCount + 1;
    badge.style.display = 'flex';
  }

  hideNotification() {
    const badge = document.getElementById('aisup-badge');
    badge.textContent = '0';
    badge.style.display = 'none';
  }

  hideLoading() {
    const loading = document.getElementById('aisup-loading');
    if (loading) loading.style.display = 'none';
  }

  scrollToBottom() {
    const messagesContainer = document.getElementById('aisup-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.container.classList.add('aisup-open');
    this.hideNotification();
    setTimeout(() => this.scrollToBottom(), 100);
    document.getElementById('aisup-input')?.focus();
  }

  close() {
    this.isOpen = false;
    this.container.classList.remove('aisup-open');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Attach widget toggle to custom element(s)
   * @param {string|Element|Element[]} selector - CSS selector, element, or array of elements
   * @returns {AISupportWidget} - Returns this for chaining
   */
  attachTo(selector) {
    let elements = [];
    
    if (typeof selector === 'string') {
      elements = Array.from(document.querySelectorAll(selector));
    } else if (selector instanceof Element) {
      elements = [selector];
    } else if (Array.isArray(selector)) {
      elements = selector;
    }
    
    elements.forEach(el => {
      const handler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggle();
      };
      el.addEventListener('click', handler);
      this.boundTriggers.push({ element: el, handler });
    });
    
    return this;
  }

  /**
   * Remove all attached triggers
   */
  detach() {
    this.boundTriggers.forEach(({ element, handler }) => {
      element.removeEventListener('click', handler);
    });
    this.boundTriggers = [];
    return this;
  }

  destroy() {
    this.detach();
    if (this.socket) {
      this.socket.disconnect();
    }
    if (this.container) {
      this.container.remove();
    }
  }
}

// Export for browser
window.AISupportWidget = AISupportWidget;

export default AISupportWidget;
