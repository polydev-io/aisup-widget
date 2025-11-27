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
  
  // Headless mode - hide built-in toggle button
  headless?: boolean;
}

declare class AISupportWidget {
  constructor(config: AISupportWidgetConfig);
  
  /** Open the chat window */
  open(): void;
  
  /** Close the chat window */
  close(): void;
  
  /** Toggle the chat window */
  toggle(): void;
  
  /** 
   * Attach widget toggle to custom element(s)
   * @param selector - CSS selector, element, or array of elements
   */
  attachTo(selector: string | Element | Element[]): this;
  
  /** Remove all attached triggers */
  detach(): this;
  
  /** Destroy the widget and cleanup */
  destroy(): void;
  
  /** Current open state */
  readonly isOpen: boolean;
  
  /** Whether the widget is initialized */
  readonly isInitialized: boolean;
}

export default AISupportWidget;
