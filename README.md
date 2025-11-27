# 🤖 AI Support Widget

Встраиваемый виджет чата поддержки с AI. Подключается на любой сайт одной строкой кода.

## 🚀 Быстрый старт

### Способ 1: CDN (самый простой)

```html
<script src="https://cdn.jsdelivr.net/gh/polydev-io/aisup-widget@main/dist/widget.iife.js"></script>
<script>
  new AISupportWidget({
    apiKey: 'YOUR_API_KEY',
    apiUrl: 'https://your-api-server.com'
  });
</script>
```

### Способ 2: npm install из GitHub

```bash
npm install github:polydev-io/aisup-widget
```

Если возникает конфликт зависимостей:

```bash
npm install github:polydev-io/aisup-widget --legacy-peer-deps
```

---

## 📦 Варианты подключения

### 1. Флоатинг кнопка в углу экрана

Виджет создаёт кнопку в правом нижнем углу. При клике открывается чат.

```html
<script src="https://cdn.jsdelivr.net/gh/polydev-io/aisup-widget@main/dist/widget.iife.js"></script>
<script>
  new AISupportWidget({
    apiKey: 'YOUR_API_KEY',
    apiUrl: 'https://your-api-server.com',
    primaryColor: '#4F46E5',
    position: 'bottom-right',
    headerTitle: 'Поддержка',
    headerSubtitle: 'Онлайн'
  });
</script>
```

### 2. Кастомная кнопка (headless режим)

Используйте свою кнопку для открытия чата:

```html
<button id="my-chat-btn">💬 Написать в поддержку</button>

<script src="https://cdn.jsdelivr.net/gh/polydev-io/aisup-widget@main/dist/widget.iife.js"></script>
<script>
  const widget = new AISupportWidget({
    apiKey: 'YOUR_API_KEY',
    apiUrl: 'https://your-api-server.com',
    headless: true  // Скрывает встроенную кнопку
  });
  
  // Привязать к вашей кнопке
  widget.attachTo('#my-chat-btn');
</script>
```

### 3. Программное управление

```javascript
const widget = new AISupportWidget({ 
  apiKey: 'xxx', 
  apiUrl: 'https://...',
  headless: true 
});

// Управление
widget.open();   // Открыть чат
widget.close();  // Закрыть чат
widget.toggle(); // Переключить

// Привязать к нескольким кнопкам
widget.attachTo('.support-buttons');

// Отвязать все кнопки
widget.detach();

// Полностью удалить виджет
widget.destroy();
```

### 4. React / Next.js

**Вариант A: Через CDN (рекомендуется — без конфликтов зависимостей)**

```tsx
'use client';
import { useEffect } from 'react';

declare global {
  interface Window { AISupportWidget: any; }
}

export function ChatWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/polydev-io/aisup-widget@main/dist/widget.iife.js';
    script.async = true;
    script.onload = () => {
      new window.AISupportWidget({
        apiKey: 'YOUR_API_KEY',
        apiUrl: 'https://your-api-server.com',
        primaryColor: '#4F46E5'
      });
    };
    document.body.appendChild(script);
    
    return () => { script.remove(); };
  }, []);

  return null;
}
```

**Вариант B: Через npm (если нет конфликтов)**

```tsx
'use client';
import { AISupportChatWidget } from 'aisup-widget/react';
import 'aisup-widget/widget.css';

export function ChatWidget() {
  return (
    <AISupportChatWidget 
      apiKey="YOUR_API_KEY"
      apiUrl="https://your-api-server.com"
      primaryColor="#4F46E5"
    />
  );
}
```

**С кастомной кнопкой:**

```tsx
<AISupportChatWidget apiKey="xxx" apiUrl="https://...">
  <button>💬 Открыть чат</button>
</AISupportChatWidget>
```

**Хук для программного управления:**

```tsx
import { useAISupportWidget } from 'aisup-widget/react';

function MyComponent() {
  const { open, close, isOpen, isReady } = useAISupportWidget({
    apiKey: 'xxx',
    apiUrl: 'https://...',
    headless: true
  });

  return (
    <button onClick={open} disabled={!isReady}>
      {isOpen ? 'Закрыть' : 'Открыть'} чат
    </button>
  );
}
```

---

## ⚙️ Все настройки

### Обязательные параметры

| Параметр | Тип | Описание |
|----------|-----|----------|
| `apiKey` | string | API ключ из backend (получить у администратора) |
| `apiUrl` | string | URL вашего API сервера |

### Опциональные параметры

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `wsUrl` | string | = apiUrl | URL WebSocket (обычно совпадает с apiUrl) |
| `userName` | string | `'Guest'` | Имя пользователя в чате |
| `headless` | boolean | `false` | Скрыть встроенную кнопку |

### Цвета

| Параметр | По умолчанию | Описание |
|----------|--------------|----------|
| `primaryColor` | `'#4F46E5'` | Основной цвет (кнопка, ваши сообщения) |
| `secondaryColor` | `'#FFFFFF'` | Фон окна чата |
| `textColor` | `'#1F2937'` | Цвет текста |
| `botMessageBg` | `'#F3F4F6'` | Фон сообщений бота |
| `userMessageBg` | `'#4F46E5'` | Фон ваших сообщений |
| `userMessageText` | `'#FFFFFF'` | Цвет текста ваших сообщений |

### Позиция и размеры

| Параметр | По умолчанию | Описание |
|----------|--------------|----------|
| `position` | `'bottom-right'` | `'bottom-right'` или `'bottom-left'` |
| `offsetX` | `'20px'` | Отступ от края по горизонтали |
| `offsetY` | `'20px'` | Отступ от края по вертикали |
| `widgetWidth` | `'380px'` | Ширина окна чата |
| `widgetHeight` | `'600px'` | Высота окна чата |
| `buttonSize` | `'60px'` | Размер кнопки |

### Тексты

| Параметр | По умолчанию | Описание |
|----------|--------------|----------|
| `headerTitle` | `'Поддержка'` | Заголовок в шапке чата |
| `headerSubtitle` | `'Онлайн'` | Подзаголовок в шапке |
| `placeholderText` | `'Напишите сообщение...'` | Placeholder в поле ввода |
| `welcomeMessage` | `'Здравствуйте!'` | Приветственное сообщение |

### Внешний вид

| Параметр | По умолчанию | Описание |
|----------|--------------|----------|
| `borderRadius` | `'12px'` | Скругление углов окна |
| `buttonRadius` | `'50%'` | Скругление кнопки |
| `fontFamily` | system fonts | Шрифт |
| `fontSize` | `'14px'` | Размер шрифта |
| `zIndex` | `999999` | Z-index виджета |
| `enableAnimations` | `true` | Включить анимации |

---

## 🔧 Методы API

```javascript
const widget = new AISupportWidget(config);

widget.open();                  // Открыть чат
widget.close();                 // Закрыть чат  
widget.toggle();                // Переключить открыт/закрыт
widget.attachTo('#btn');        // Привязать к кнопке
widget.attachTo('.buttons');    // Привязать к нескольким кнопкам
widget.detach();                // Отвязать все кнопки
widget.destroy();               // Полностью удалить виджет

// Свойства (только чтение)
widget.isOpen;                  // Открыт ли чат
widget.isInitialized;           // Инициализирован ли виджет
```

---

## 🎨 CSS переменные

Можно переопределить стили через CSS:

```css
.aisup-widget {
  --aisup-primary: #10B981;
  --aisup-primary-hover: #059669;
  --aisup-radius: 16px;
  --aisup-shadow: 0 10px 40px rgba(0,0,0,0.2);
}
```

---

## 📦 Полный пример конфигурации

```javascript
new AISupportWidget({
  // Обязательные
  apiKey: 'aisup_xxxxxxxxxxxxxxxxxxxxxxxx',
  apiUrl: 'https://api.your-domain.com',
  
  // Пользователь
  userName: 'Иван Иванов',
  
  // Цвета
  primaryColor: '#10B981',
  userMessageBg: '#10B981',
  botMessageBg: '#F3F4F6',
  
  // Позиция
  position: 'bottom-right',
  offsetX: '24px',
  offsetY: '24px',
  
  // Размеры
  widgetWidth: '400px',
  widgetHeight: '550px',
  buttonSize: '56px',
  
  // Тексты
  headerTitle: 'Служба поддержки',
  headerSubtitle: 'Обычно отвечаем за 5 минут',
  placeholderText: 'Введите сообщение...',
  
  // Дополнительно
  headless: false,
  enableAnimations: true,
  zIndex: 999999
});
```

---

## 🔌 Headless API (без UI)

Используйте API и Socket клиенты напрямую без виджета:

```typescript
import { AISupportAPIClient, AISupportSocketClient } from 'aisup-widget';

// API клиент
const api = new AISupportAPIClient({
  apiKey: 'xxx',
  apiUrl: 'https://api.example.com'
});

await api.init();
await api.sendMessage('Hello!');
const history = await api.getMessages();

// Socket клиент
const socket = new AISupportSocketClient(config);
socket.setHandlers({
  onMessage: (msg) => console.log('New:', msg),
  onConnectionChange: (status) => console.log('Status:', status)
});
socket.connect();
await socket.joinChat(chatId);
```

React хуки:

```tsx
import { useAISupport, useAISupportAPI, useAISupportSocket } from 'aisup-widget';

// Комбинированный хук
const { messages, sendMessage, isConnected } = useAISupport({
  apiKey: 'xxx',
  apiUrl: 'https://...',
  autoInit: true
});

// Отдельно API
const api = useAISupportAPI({ apiKey, apiUrl });

// Отдельно Socket
const socket = useAISupportSocket({ apiKey, apiUrl });
```

---

## 📱 Мобильные SDK

- **iOS**: [github.com/polydev-io/aisup-ios](https://github.com/polydev-io/aisup-ios)
- **Android**: [github.com/polydev-io/aisup-android](https://github.com/polydev-io/aisup-android)

---

## ✨ Возможности

- 💬 Real-time чат через WebSocket
- 🤖 AI автоответы
- 👤 Переключение на живого оператора
- 📎 Загрузка файлов (до 10MB)
- 📱 Адаптивный дизайн (полноэкранный режим на мобильных)
- 💾 Сохранение истории чата
- 🔔 Уведомления о новых сообщениях

---

## 📱 Поддержка

| Платформа | Версия |
|-----------|--------|
| Chrome, Firefox, Safari, Edge | Последние 2 версии |
| React | 16.8+ |
| Next.js | 12+ |

---

## 📝 Лицензия

MIT
