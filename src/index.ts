// Vanilla JS Widget
export { default as AISupportWidget } from './widget';
export type { AISupportWidgetConfig } from './widget.d';

// Core clients (no UI)
export { AISupportAPIClient } from './api-client';
export type { 
  AISupportConfig, 
  Message, 
  Attachment, 
  Chat,
  InitResponse,
  SendMessageResponse,
  MessagesResponse 
} from './api-client';

export { AISupportSocketClient } from './socket-client';
export type { ConnectionStatus, SocketEventHandlers } from './socket-client';

// React hooks (no UI)
export { useAISupportAPI, useAISupportSocket, useAISupport } from './hooks';
export type {
  UseAISupportAPIOptions,
  UseAISupportAPIReturn,
  UseAISupportSocketOptions,
  UseAISupportSocketReturn,
  UseAISupportOptions,
  UseAISupportReturn
} from './hooks';

// React UI component (also available via 'aisup-widget/react')
export { AISupportChatWidget, useAISupportWidget } from './react';
