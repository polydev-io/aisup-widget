/**
 * AISup Socket Client
 * Standalone WebSocket client for real-time communication with AISup backend
 * Can be used without the UI widget
 */

import { io, Socket } from 'socket.io-client';
import type { AISupportConfig, Message, Chat } from './api-client';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface SocketEventHandlers {
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onError?: (error: Error) => void;
  onMessage?: (message: Message) => void;
  onChatUpdated?: (chat: Chat) => void;
  onTyping?: (isTyping: boolean) => void;
  onConnectionChange?: (status: ConnectionStatus) => void;
}

export class AISupportSocketClient {
  private config: AISupportConfig;
  private socket: Socket | null = null;
  private chatId: string | null = null;
  private handlers: SocketEventHandlers = {};
  private status: ConnectionStatus = 'disconnected';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(config: AISupportConfig) {
    this.config = {
      ...config,
      wsUrl: config.wsUrl || config.apiUrl,
    };
  }

  /**
   * Get current connection status
   */
  getStatus(): ConnectionStatus {
    return this.status;
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.status === 'connected' && this.socket?.connected === true;
  }

  /**
   * Set event handlers
   */
  setHandlers(handlers: SocketEventHandlers): void {
    this.handlers = { ...this.handlers, ...handlers };
  }

  /**
   * Connect to WebSocket server
   */
  connect(): void {
    if (this.socket?.connected) {
      return;
    }

    this.setStatus('connecting');

    this.socket = io(this.config.wsUrl!, {
      auth: { apiKey: this.config.apiKey },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.setupEventListeners();
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.setStatus('disconnected');
  }

  /**
   * Join a chat room to receive messages
   */
  async joinChat(chatId: string): Promise<{ status: string; chatId?: string; message?: string }> {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected. Call connect() first.');
    }

    this.chatId = chatId;

    return new Promise((resolve, reject) => {
      this.socket!.emit('integration_join', { chatId }, (response: { status: string; chatId?: string; message?: string }) => {
        if (response.status === 'ok') {
          resolve(response);
        } else {
          reject(new Error(response.message || 'Failed to join chat'));
        }
      });
    });
  }

  /**
   * Leave current chat room
   */
  async leaveChat(): Promise<void> {
    if (!this.socket?.connected || !this.chatId) {
      return;
    }

    return new Promise((resolve) => {
      this.socket!.emit('integration_leave', { chatId: this.chatId }, () => {
        this.chatId = null;
        resolve();
      });
    });
  }

  /**
   * Send typing indicator
   */
  sendTyping(isTyping: boolean): void {
    if (!this.socket?.connected || !this.chatId) {
      return;
    }

    this.socket.emit('typing', { chatId: this.chatId, isTyping });
  }

  private setStatus(status: ConnectionStatus): void {
    this.status = status;
    this.handlers.onConnectionChange?.(status);
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.reconnectAttempts = 0;
      this.setStatus('connected');
      this.handlers.onConnect?.();

      // Rejoin chat if we were in one
      if (this.chatId) {
        this.joinChat(this.chatId).catch(console.error);
      }
    });

    this.socket.on('disconnect', (reason) => {
      this.setStatus('disconnected');
      this.handlers.onDisconnect?.(reason);
    });

    this.socket.on('connect_error', (error) => {
      this.reconnectAttempts++;
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.setStatus('error');
      }
      this.handlers.onError?.(error);
    });

    this.socket.on('message_added', ({ message }: { chatId: string; message: Message }) => {
      this.handlers.onMessage?.(message);
    });

    this.socket.on('chat_updated', ({ chat }: { chatId: string; chat: Chat }) => {
      this.handlers.onChatUpdated?.(chat);
    });

    this.socket.on('typing', ({ isTyping }: { isTyping: boolean }) => {
      this.handlers.onTyping?.(isTyping);
    });
  }
}

export default AISupportSocketClient;
