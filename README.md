# 🤖 AI Support Widget

Встраиваемый виджет чата поддержки с искусственным интеллектом.

## ✨ Возможности

- 💬 **Real-time чат** через WebSocket
- 🤖 **AI автоответы** через Qwen/N8n
- 👤 **Переключение на операторов**
- 📎 **Загрузка файлов** (изображения, видео, документы до 10MB)
- 📱 **Полная мобильная адаптация** (полноэкранный режим на смартфонах)
- 🎨 **Настраиваемый дизайн**
- 📱 **Адаптивный интерфейс**
- 🔒 **Безопасная аутентификация** через API ключ
- 💾 **Сохранение истории** в localStorage
- 🔔 **Уведомления** о новых сообщениях

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запуск dev сервера

```bash
npm run dev
```

Откроется demo страница на `http://localhost:5173/demo.html`

### 3. Сборка для production

```bash
npm run build
```

Результат будет в папке `dist/`:
- `dist/widget.iife.js` - Для подключения через `<script>` тег
- `dist/widget.esm.js` - ES Module для современных бандлеров
- `dist/widget.umd.js` - UMD для CommonJS/AMD
- `dist/react.esm.js` - React компонент
- `dist/widget.css` - Стили виджета

## 📦 Способы подключения

### Вариант 1: Подключение через `<script>` (флоатинг кнопка)

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <!-- Ваш контент -->

  <!-- AI Support Widget -->
  <script src="https://your-cdn.com/widget.iife.js"></script>
  <script>
    new AISupportWidget({
      apiKey: 'YOUR_API_KEY',
      apiUrl: 'https://your-api.com',
      wsUrl: 'https://your-api.com',
      userName: 'Гость',
      primaryColor: '#4F46E5',
      position: 'bottom-right'
    });
  </script>
</body>
</html>
```

### Вариант 2: Headless режим с кастомной кнопкой

```html
<button id="my-support-btn">Открыть чат</button>

<script src="https://your-cdn.com/widget.iife.js"></script>
<script>
  const widget = new AISupportWidget({
    apiKey: 'YOUR_API_KEY',
    apiUrl: 'https://your-api.com',
    headless: true  // Скрывает встроенную кнопку
  });
  
  // Привязка к кастомной кнопке
  widget.attachTo('#my-support-btn');
  
  // Или программное управление
  // widget.open();
  // widget.close();
  // widget.toggle();
</script>
```

### Вариант 3: React / Next.js

```bash
npm install aisup-widget
```

**Флоатинг кнопка:**
```tsx
import { AISupportChatWidget } from 'aisup-widget/react';
import 'aisup-widget/widget.css';

export default function App() {
  return (
    <div>
      <h1>My App</h1>
      <AISupportChatWidget 
        apiKey="YOUR_API_KEY"
        apiUrl="https://your-api.com"
        primaryColor="#4F46E5"
      />
    </div>
  );
}
```

**Кастомная кнопка (через children):**
```tsx
import { AISupportChatWidget } from 'aisup-widget/react';
import 'aisup-widget/widget.css';

export default function App() {
  return (
    <div>
      <h1>My App</h1>
      <AISupportChatWidget apiKey="YOUR_API_KEY" apiUrl="https://your-api.com">
        <button>💬 Открыть чат</button>
      </AISupportChatWidget>
    </div>
  );
}
```

**Использование хука:**
```tsx
import { useAISupportWidget } from 'aisup-widget/react';
import 'aisup-widget/widget.css';

export default function MyComponent() {
  const { open, close, toggle, isOpen, isReady } = useAISupportWidget({
    apiKey: 'YOUR_API_KEY',
    apiUrl: 'https://your-api.com',
    headless: true
  });

  return (
    <button onClick={open} disabled={!isReady}>
      {isOpen ? 'Закрыть' : 'Открыть'} чат
    </button>
  );
}
```

**Next.js (App Router) - важно использовать 'use client':**
```tsx
'use client';

import dynamic from 'next/dynamic';

const AISupportChatWidget = dynamic(
  () => import('aisup-widget/react').then(mod => mod.AISupportChatWidget),
  { ssr: false }
);

export default function ChatWidget() {
  return (
    <AISupportChatWidget 
      apiKey="YOUR_API_KEY"
      apiUrl="https://your-api.com"
    />
  );
}
```

## ⚙️ Конфигурация

| Параметр | Тип | По умолчанию | Описание |
|----------|------|--------------|----------|
| `apiKey` | string | **обязательно** | API ключ из backend |
| `apiUrl` | string | `http://localhost:3000` | URL REST API |
| `wsUrl` | string | `http://localhost:3000` | URL WebSocket сервера |
| `userName` | string | `'Guest'` | Имя пользователя |
| **Цвета** |
| `primaryColor` | string | `'#4F46E5'` | Основной цвет (кнопка, сообщения пользователя) |
| `secondaryColor` | string | `'#FFFFFF'` | Фон окна чата |
| `textColor` | string | `'#1F2937'` | Цвет текста |
| `botMessageBg` | string | `'#F3F4F6'` | Фон сообщений бота |
| `userMessageBg` | string | `'#4F46E5'` | Фон сообщений пользователя |
| `userMessageText` | string | `'#FFFFFF'` | Цвет текста в сообщениях пользователя |
| **Позиционирование** |
| `position` | string | `'bottom-right'` | `bottom-right` или `bottom-left` |
| `offsetX` | string | `'20px'` | Отступ по горизонтали |
| `offsetY` | string | `'20px'` | Отступ по вертикали |
| **Размеры** |
| `widgetWidth` | string | `'380px'` | Ширина окна чата |
| `widgetHeight` | string | `'600px'` | Высота окна чата |
| `buttonSize` | string | `'60px'` | Размер кнопки открытия |
| **Типографика** |
| `fontFamily` | string | `-apple-system, ...` | Семейство шрифтов |
| `fontSize` | string | `'14px'` | Размер шрифта |
| **Скругления** |
| `borderRadius` | string | `'12px'` | Радиус окна чата |
| `buttonRadius` | string | `'50%'` | Радиус кнопки |
| `messageBubbleRadius` | string | `'12px'` | Радиус сообщений |
| **Текст** |
| `welcomeMessage` | string | `'Здравствуйте! Чем могу помочь?'` | Приветственное сообщение |
| `buttonText` | string | `'Поддержка'` | Текст на кнопке |
| `placeholderText` | string | `'Напишите сообщение...'` | Placeholder в поле ввода |
| `headerTitle` | string | `'Поддержка'` | Заголовок в шапке |
| `headerSubtitle` | string | `'Онлайн'` | Подзаголовок в шапке |
| **Дополнительно** |
| `enableAnimations` | boolean | `true` | Включить анимации |
| `showTimestamp` | boolean | `true` | Показывать время сообщений |
| `showAvatar` | boolean | `true` | Показывать аватары |
| `zIndex` | number | `999999` | Z-index виджета |
| `headless` | boolean | `false` | Скрыть встроенную кнопку (для кастомной) |

**📚 Подробнее**: См. [Руководство по кастомизации](CUSTOMIZATION.md) с готовыми темами и примерами!

## 🧪 Тестирование

### Предварительные требования

1. Backend сервер должен быть запущен:
```bash
cd ../aisup-backend
npm run dev
```

2. У вас должен быть API ключ REST бота (создайте через CLI если нужно):
```bash
cd ../aisup-backend
npm run bot:add-integration
```

### Запуск demo

```bash
npm run dev
```

Откройте `http://localhost:5173/demo.html` и протестируйте:
1. Нажмите на кнопку виджета
2. Отправьте сообщение
3. Дождитесь ответа от AI
4. Попробуйте изменить настройки

## 📱 Поддержка браузеров и устройств

**Десктоп:**
- Chrome/Edge (последние 2 версии)
- Firefox (последние 2 версии)
- Safari (последние 2 версии)

**Мобильные:**
- Mobile Safari (iOS 12+) - полноэкранный режим
- Mobile Chrome (Android 8+) - полноэкранный режим
- Планшеты (iPad, Android tablets) - адаптивный размер

**Особенности мобильной версии:**
- Полноэкранный режим на смартфонах (< 480px)
- Touch-оптимизированные кнопки (min 44x44px)
- Предотвращение зума iOS при фокусе
- Responsive изображения и видео

📚 **Подробнее**: [Файлы и мобильная версия](FILE_UPLOAD_AND_MOBILE.md)

## 🔧 API методы

### Создание виджета

```javascript
const widget = new AISupportWidget(config);
```

### Методы экземпляра

```javascript
widget.open();                      // Открыть чат
widget.close();                     // Закрыть чат
widget.toggle();                    // Переключить состояние
widget.attachTo('#my-btn');         // Привязать к элементу
widget.attachTo('.support-btns');   // Привязать к нескольким элементам
widget.detach();                    // Отвязать все триггеры
widget.destroy();                   // Удалить виджет из DOM
```

## 🎨 Кастомизация стилей

Виджет использует CSS переменные для кастомизации:

```css
:root {
  --aisup-primary: #4F46E5;
  --aisup-primary-hover: #4338CA;
  --aisup-bg: #FFFFFF;
  --aisup-text: #1F2937;
  --aisup-radius: 12px;
}
```

Вы можете переопределить их в своем CSS:

```css
.aisup-widget {
  --aisup-primary: #FF0000;
  --aisup-radius: 20px;
}
```

## 📂 Структура проекта

```
aisup-widget/
├── src/
│   ├── widget.js      # Основная логика виджета (vanilla JS)
│   ├── widget.css     # Стили виджета
│   ├── react.tsx      # React компонент и хук
│   ├── widget.d.ts    # TypeScript типы
│   └── index.ts       # Экспорты
├── dist/              # Собранные файлы (после build)
├── demo.html          # Demo страница
├── vite.config.js     # Конфигурация сборки
├── tsconfig.json      # TypeScript конфиг
├── package.json
└── README.md
```

## 🚀 Сборка и деплой

### Сборка

```bash
npm install
npm run build
```

### Где разместить для подключения на сайты:

1. **CDN (jsDelivr, unpkg)** - после публикации в npm:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/aisup-widget/dist/widget.iife.js"></script>
   ```

2. **Свой сервер/S3/CloudFront:**
   - Загрузите `dist/widget.iife.js` и `dist/widget.css`
   - Дайте публичный URL

3. **Netlify/Vercel:**
   - Загрузите папку `dist` как статику

### Публикация в npm

```bash
# 1. Убедитесь что вы залогинены
npm login

# 2. Обновите версию в package.json

# 3. Опубликуйте
npm publish
```

После публикации пакет будет доступен:
- `npm install aisup-widget`
- CDN: `https://cdn.jsdelivr.net/npm/aisup-widget`

## 🔌 Интеграция с Backend

Виджет использует REST API и WebSocket из `aisup-backend`:

**REST API endpoints:**
- `POST /api/integration/init` - Инициализация чата
- `POST /api/integration/send-message` - Отправка сообщения
- `POST /api/integration/messages` - Получение истории

**WebSocket события:**
- `integration_join` - Подключиться к чату
- `message_added` - Новое сообщение
- `chat_updated` - Обновление чата

Документация API: `../aisup-backend/docs/INTEGRATION_API.md`

## 🐛 Отладка

Включите логирование в консоли браузера:

```javascript
localStorage.setItem('aisup_debug', 'true');
```

Логи будут показываться с префиксом `[AISup]`.

## 📝 Лицензия

MIT

## 🤝 Поддержка

Для вопросов и поддержки создайте issue в репозитории.
