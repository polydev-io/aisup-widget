/**
 * AISup API Client
 * Standalone API client for integration with AISup backend
 * Can be used without the UI widget
 */

export interface AISupportConfig {
  apiKey: string;
  apiUrl: string;
  wsUrl?: string;
  userName?: string;
}

export interface Message {
  _id: string;
  chat: string;
  content: string;
  sender: 'user' | 'bot' | 'operator';
  senderName?: string;
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  type: 'image' | 'video' | 'file';
  url: string;
  name: string;
  size?: number;
  mimeType?: string;
}

export interface Chat {
  _id: string;
  chatId: string;
  platform: string;
  status: 'active' | 'closed' | 'pending';
  mode: 'bot' | 'operator';
  userName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InitResponse {
  success: boolean;
  chatId: string;
  chat: Chat;
  welcomeMessage?: string;
}

export interface SendMessageResponse {
  success: boolean;
  message: Message;
}

export interface MessagesResponse {
  success: boolean;
  messages: Message[];
  hasMore: boolean;
}

export interface UploadResponse {
  success: boolean;
  attachment: Attachment;
}

export class AISupportAPIClient {
  private config: AISupportConfig;
  private chatId: string | null = null;

  constructor(config: AISupportConfig) {
    this.config = {
      ...config,
      wsUrl: config.wsUrl || config.apiUrl,
      userName: config.userName || 'Guest',
    };
  }

  /**
   * Get the current chat ID
   */
  getChatId(): string | null {
    return this.chatId;
  }

  /**
   * Set chat ID (useful when restoring from storage)
   */
  setChatId(chatId: string): void {
    this.chatId = chatId;
  }

  /**
   * Get configuration
   */
  getConfig(): AISupportConfig {
    return { ...this.config };
  }

  /**
   * Initialize a new chat session
   */
  async init(): Promise<InitResponse> {
    const response = await fetch(`${this.config.apiUrl}/api/integration/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.apiKey,
      },
      body: JSON.stringify({
        userName: this.config.userName,
        chatId: this.chatId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Init failed: ${response.status} ${response.statusText}`);
    }

    const data: InitResponse = await response.json();
    this.chatId = data.chatId;
    return data;
  }

  /**
   * Send a text message
   */
  async sendMessage(content: string, attachments?: Attachment[]): Promise<SendMessageResponse> {
    if (!this.chatId) {
      throw new Error('Chat not initialized. Call init() first.');
    }

    const response = await fetch(`${this.config.apiUrl}/api/integration/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.apiKey,
      },
      body: JSON.stringify({
        chatId: this.chatId,
        content,
        attachments,
      }),
    });

    if (!response.ok) {
      throw new Error(`Send message failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get message history
   */
  async getMessages(limit = 50, before?: string): Promise<MessagesResponse> {
    if (!this.chatId) {
      throw new Error('Chat not initialized. Call init() first.');
    }

    const params = new URLSearchParams({
      chatId: this.chatId,
      limit: limit.toString(),
    });

    if (before) {
      params.append('before', before);
    }

    const response = await fetch(`${this.config.apiUrl}/api/integration/messages?${params}`, {
      method: 'GET',
      headers: {
        'X-API-Key': this.config.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Get messages failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Upload a file
   */
  async uploadFile(file: File): Promise<UploadResponse> {
    if (!this.chatId) {
      throw new Error('Chat not initialized. Call init() first.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('chatId', this.chatId);

    const response = await fetch(`${this.config.apiUrl}/api/integration/upload`, {
      method: 'POST',
      headers: {
        'X-API-Key': this.config.apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Mark messages as read
   */
  async markAsRead(): Promise<void> {
    if (!this.chatId) {
      return;
    }

    await fetch(`${this.config.apiUrl}/api/integration/mark-read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.apiKey,
      },
      body: JSON.stringify({
        chatId: this.chatId,
      }),
    });
  }
}

export default AISupportAPIClient;
