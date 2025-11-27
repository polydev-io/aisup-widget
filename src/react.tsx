import { useEffect, useRef, useCallback, useState } from 'react';
import AISupportWidget from './widget';

export interface AISupportWidgetConfig {
  // Required
  apiKey: string;
  
  // API Configuration
  apiUrl?: string;
  wsUrl?: string;
  userName?: string;
  
  // Colors
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  botMessageBg?: string;
  userMessageBg?: string;
  userMessageText?: string;
  
  // Positioning
  position?: 'bottom-right' | 'bottom-left';
  offsetX?: string;
  offsetY?: string;
  
  // Sizing
  widgetWidth?: string;
  widgetHeight?: string;
  buttonSize?: string;
  
  // Typography
  fontFamily?: string;
  fontSize?: string;
  
  // Border Radius
  borderRadius?: string;
  buttonRadius?: string;
  messageBubbleRadius?: string;
  
  // Text & Messages
  welcomeMessage?: string;
  buttonText?: string;
  placeholderText?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  
  // Icons & Avatar
  botAvatar?: string | null;
  userAvatar?: string | null;
  
  // Features
  enableAnimations?: boolean;
  showTimestamp?: boolean;
  showAvatar?: boolean;
  enableSound?: boolean;
  
  // Z-index
  zIndex?: number;
  
  // Headless mode
  headless?: boolean;
}

export interface AISupportWidgetProps extends AISupportWidgetConfig {
  /** Auto open on mount */
  autoOpen?: boolean;
  /** Callback when widget opens */
  onOpen?: () => void;
  /** Callback when widget closes */
  onClose?: () => void;
  /** Children elements to use as custom triggers */
  children?: React.ReactNode;
}

/**
 * React component wrapper for AISupportWidget
 * 
 * @example Basic usage with floating button
 * ```tsx
 * <AISupportChatWidget apiKey="your-api-key" apiUrl="https://api.example.com" />
 * ```
 * 
 * @example Headless mode with custom trigger
 * ```tsx
 * <AISupportChatWidget apiKey="your-api-key" headless>
 *   <button>Open Chat</button>
 * </AISupportChatWidget>
 * ```
 */
export function AISupportChatWidget({
  children,
  autoOpen,
  onOpen,
  onClose,
  ...config
}: AISupportWidgetProps) {
  const widgetRef = useRef<AISupportWidget | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize widget
  useEffect(() => {
    // Determine if headless based on children presence or explicit config
    const isHeadless = config.headless ?? !!children;
    
    widgetRef.current = new AISupportWidget({
      ...config,
      headless: isHeadless
    });

    if (autoOpen) {
      widgetRef.current.open();
      setIsOpen(true);
    }

    return () => {
      widgetRef.current?.destroy();
      widgetRef.current = null;
    };
  }, [config.apiKey, config.apiUrl, config.wsUrl]);

  // Attach to trigger elements when children exist
  useEffect(() => {
    if (children && triggerRef.current && widgetRef.current) {
      const clickableElements = triggerRef.current.querySelectorAll('button, a, [role="button"]');
      if (clickableElements.length > 0) {
        widgetRef.current.attachTo(Array.from(clickableElements) as Element[]);
      } else {
        // If no button/link found, use the container itself
        widgetRef.current.attachTo(triggerRef.current);
      }
    }
  }, [children]);

  // Track open/close state
  useEffect(() => {
    if (!widgetRef.current) return;
    
    const originalOpen = widgetRef.current.open.bind(widgetRef.current);
    const originalClose = widgetRef.current.close.bind(widgetRef.current);
    
    widgetRef.current.open = function() {
      originalOpen();
      setIsOpen(true);
      onOpen?.();
    };
    
    widgetRef.current.close = function() {
      originalClose();
      setIsOpen(false);
      onClose?.();
    };
  }, [onOpen, onClose]);

  // Expose methods via callback ref pattern
  const open = useCallback(() => {
    widgetRef.current?.open();
  }, []);

  const close = useCallback(() => {
    widgetRef.current?.close();
  }, []);

  const toggle = useCallback(() => {
    widgetRef.current?.toggle();
  }, []);

  // If children provided, render them as trigger
  if (children) {
    return (
      <div ref={triggerRef} style={{ display: 'inline-block' }}>
        {children}
      </div>
    );
  }

  // Otherwise render nothing (widget creates its own button)
  return null;
}

/**
 * Hook for programmatic widget control
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { widget, open, close, toggle, isReady } = useAISupportWidget({
 *     apiKey: 'your-key',
 *     apiUrl: 'https://api.example.com',
 *     headless: true
 *   });
 * 
 *   return <button onClick={open}>Open Support</button>;
 * }
 * ```
 */
export function useAISupportWidget(config: AISupportWidgetConfig) {
  const widgetRef = useRef<AISupportWidget | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    widgetRef.current = new AISupportWidget(config);
    setIsReady(true);

    // Intercept open/close to track state
    const originalOpen = widgetRef.current.open.bind(widgetRef.current);
    const originalClose = widgetRef.current.close.bind(widgetRef.current);
    
    widgetRef.current.open = function() {
      originalOpen();
      setIsOpen(true);
    };
    
    widgetRef.current.close = function() {
      originalClose();
      setIsOpen(false);
    };

    return () => {
      widgetRef.current?.destroy();
      widgetRef.current = null;
      setIsReady(false);
    };
  }, [config.apiKey, config.apiUrl, config.wsUrl]);

  const open = useCallback(() => widgetRef.current?.open(), []);
  const close = useCallback(() => widgetRef.current?.close(), []);
  const toggle = useCallback(() => widgetRef.current?.toggle(), []);
  const attachTo = useCallback((selector: string | Element | Element[]) => {
    widgetRef.current?.attachTo(selector);
  }, []);

  return {
    widget: widgetRef.current,
    isReady,
    isOpen,
    open,
    close,
    toggle,
    attachTo
  };
}

// Re-export the base widget class
export { AISupportWidget };
export default AISupportChatWidget;
