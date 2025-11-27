/**
 * AISup React Hooks
 * React hooks for API and Socket clients
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { AISupportAPIClient, type AISupportConfig, type Message, type Chat } from './api-client';
import { AISupportSocketClient, type ConnectionStatus } from './socket-client';

// ==================== API Hook ====================

export interface UseAISupportAPIOptions extends AISupportConfig {
  autoInit?: boolean;
  persistChatId?: boolean;
  storageKey?: string;
}

export interface UseAISupportAPIReturn {
  // State
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
  chatId: string | null;
  messages: Message[];

  // Methods
  init: () => Promise<void>;
  sendMessage: (content: string) => Promise<Message | null>;
  loadMessages: (limit?: number) => Promise<void>;
  uploadFile: (file: File) => Promise<string | null>;
  clearError: () => void;

  // Client access
  client: AISupportAPIClient;
}

export function useAISupportAPI(options: UseAISupportAPIOptions): UseAISupportAPIReturn {
  const { autoInit = false, persistChatId = true, storageKey = 'aisup_chat_id', ...config } = options;

  const clientRef = useRef<AISupportAPIClient>(new AISupportAPIClient(config));
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Restore chat ID from storage
  useEffect(() => {
    if (persistChatId && typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        clientRef.current.setChatId(stored);
        setChatId(stored);
      }
    }
  }, [persistChatId, storageKey]);

  // Auto init
  useEffect(() => {
    if (autoInit && !isInitialized && !isLoading) {
      init();
    }
  }, [autoInit]);

  const init = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await clientRef.current.init();
      setChatId(response.chatId);
      setIsInitialized(true);

      if (persistChatId && typeof window !== 'undefined') {
        localStorage.setItem(storageKey, response.chatId);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [persistChatId, storageKey]);

  const sendMessage = useCallback(async (content: string): Promise<Message | null> => {
    if (!isInitialized) {
      setError(new Error('Chat not initialized'));
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await clientRef.current.sendMessage(content);
      setMessages((prev) => [...prev, response.message]);
      return response.message;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  const loadMessages = useCallback(async (limit = 50) => {
    if (!isInitialized) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await clientRef.current.getMessages(limit);
      setMessages(response.messages);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    if (!isInitialized) {
      setError(new Error('Chat not initialized'));
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await clientRef.current.uploadFile(file);
      return response.attachment.url;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isInitialized,
    isLoading,
    error,
    chatId,
    messages,
    init,
    sendMessage,
    loadMessages,
    uploadFile,
    clearError,
    client: clientRef.current,
  };
}

// ==================== Socket Hook ====================

export interface UseAISupportSocketOptions extends AISupportConfig {
  autoConnect?: boolean;
  onMessage?: (message: Message) => void;
  onChatUpdated?: (chat: Chat) => void;
  onTyping?: (isTyping: boolean) => void;
}

export interface UseAISupportSocketReturn {
  // State
  status: ConnectionStatus;
  isConnected: boolean;
  error: Error | null;

  // Methods
  connect: () => void;
  disconnect: () => void;
  joinChat: (chatId: string) => Promise<void>;
  leaveChat: () => Promise<void>;
  sendTyping: (isTyping: boolean) => void;

  // Client access
  client: AISupportSocketClient;
}

export function useAISupportSocket(options: UseAISupportSocketOptions): UseAISupportSocketReturn {
  const { autoConnect = false, onMessage, onChatUpdated, onTyping, ...config } = options;

  const clientRef = useRef<AISupportSocketClient>(new AISupportSocketClient(config));
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const client = clientRef.current;

    client.setHandlers({
      onConnectionChange: setStatus,
      onError: setError,
      onMessage,
      onChatUpdated,
      onTyping,
    });

    if (autoConnect) {
      client.connect();
    }

    return () => {
      client.disconnect();
    };
  }, [autoConnect, onMessage, onChatUpdated, onTyping]);

  const connect = useCallback(() => {
    clientRef.current.connect();
  }, []);

  const disconnect = useCallback(() => {
    clientRef.current.disconnect();
  }, []);

  const joinChat = useCallback(async (chatId: string) => {
    await clientRef.current.joinChat(chatId);
  }, []);

  const leaveChat = useCallback(async () => {
    await clientRef.current.leaveChat();
  }, []);

  const sendTyping = useCallback((isTyping: boolean) => {
    clientRef.current.sendTyping(isTyping);
  }, []);

  return {
    status,
    isConnected: status === 'connected',
    error,
    connect,
    disconnect,
    joinChat,
    leaveChat,
    sendTyping,
    client: clientRef.current,
  };
}

// ==================== Combined Hook ====================

export interface UseAISupportOptions extends AISupportConfig {
  autoInit?: boolean;
  autoConnect?: boolean;
  persistChatId?: boolean;
  onMessage?: (message: Message) => void;
}

export interface UseAISupportReturn {
  // API State
  isInitialized: boolean;
  isLoading: boolean;
  chatId: string | null;
  messages: Message[];

  // Socket State
  isConnected: boolean;
  connectionStatus: ConnectionStatus;

  // Error
  error: Error | null;

  // Methods
  init: () => Promise<void>;
  sendMessage: (content: string) => Promise<Message | null>;
  loadMessages: (limit?: number) => Promise<void>;
  connect: () => void;
  disconnect: () => void;

  // Clients
  apiClient: AISupportAPIClient;
  socketClient: AISupportSocketClient;
}

export function useAISupport(options: UseAISupportOptions): UseAISupportReturn {
  const { onMessage, autoConnect = true, ...restOptions } = options;

  const [allMessages, setAllMessages] = useState<Message[]>([]);

  const handleMessage = useCallback((message: Message) => {
    setAllMessages((prev) => {
      // Avoid duplicates
      if (prev.some((m) => m._id === message._id)) {
        return prev;
      }
      return [...prev, message];
    });
    onMessage?.(message);
  }, [onMessage]);

  const api = useAISupportAPI(restOptions);
  const socket = useAISupportSocket({
    ...restOptions,
    autoConnect: false,
    onMessage: handleMessage,
  });

  // Sync messages
  useEffect(() => {
    if (api.messages.length > 0) {
      setAllMessages((prev) => {
        const newMessages = api.messages.filter(
          (m) => !prev.some((p) => p._id === m._id)
        );
        return [...prev, ...newMessages].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
    }
  }, [api.messages]);

  // Connect socket after init
  useEffect(() => {
    if (api.isInitialized && api.chatId && autoConnect) {
      socket.connect();
    }
  }, [api.isInitialized, api.chatId, autoConnect]);

  // Join chat after connected
  useEffect(() => {
    if (socket.isConnected && api.chatId) {
      socket.joinChat(api.chatId).catch(console.error);
    }
  }, [socket.isConnected, api.chatId]);

  return {
    isInitialized: api.isInitialized,
    isLoading: api.isLoading,
    chatId: api.chatId,
    messages: allMessages,
    isConnected: socket.isConnected,
    connectionStatus: socket.status,
    error: api.error || socket.error,
    init: api.init,
    sendMessage: api.sendMessage,
    loadMessages: api.loadMessages,
    connect: socket.connect,
    disconnect: socket.disconnect,
    apiClient: api.client,
    socketClient: socket.client,
  };
}
