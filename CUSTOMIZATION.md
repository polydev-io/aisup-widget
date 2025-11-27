# 🎨 Кастомизация виджета

Виджет поддерживает обширную кастомизацию для полного соответствия дизайну вашего сайта.

## 📋 Полный список параметров

### API Configuration

```javascript
{
  apiKey: 'your-api-key',        // Обязательный - API ключ от backend
  apiUrl: 'http://localhost:3000', // URL backend API
  wsUrl: 'http://localhost:3000',  // URL WebSocket сервера
  userName: 'Guest'                // Имя пользователя
}
```

### Цвета

```javascript
{
  // Основной цвет (кнопка, пользовательские сообщения)
  primaryColor: '#4F46E5',
  
  // Вторичный цвет (фон окна чата)
  secondaryColor: '#FFFFFF',
  
  // Цвет текста
  textColor: '#1F2937',
  
  // Фон сообщений от бота
  botMessageBg: '#F3F4F6',
  
  // Фон сообщений пользователя
  userMessageBg: '#4F46E5',
  
  // Цвет текста в сообщениях пользователя
  userMessageText: '#FFFFFF'
}
```

### Позиционирование

```javascript
{
  // Позиция виджета: 'bottom-right' или 'bottom-left'
  position: 'bottom-right',
  
  // Отступ по горизонтали
  offsetX: '20px',
  
  // Отступ по вертикали
  offsetY: '20px'
}
```

### Размеры

```javascript
{
  // Ширина окна чата
  widgetWidth: '380px',
  
  // Высота окна чата
  widgetHeight: '600px',
  
  // Размер кнопки открытия
  buttonSize: '60px'
}
```

### Типографика

```javascript
{
  // Семейство шрифтов
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  
  // Размер шрифта
  fontSize: '14px'
}
```

### Скругления

```javascript
{
  // Радиус окна чата
  borderRadius: '12px',
  
  // Радиус кнопки (50% для круглой)
  buttonRadius: '50%',
  
  // Радиус сообщений
  messageBubbleRadius: '12px'
}
```

### Текст и сообщения

```javascript
{
  // Приветственное сообщение от бота
  welcomeMessage: 'Здравствуйте! Чем могу помочь?',
  
  // Текст на кнопке виджета
  buttonText: 'Поддержка',
  
  // Placeholder в поле ввода
  placeholderText: 'Напишите сообщение...',
  
  // Заголовок в шапке чата
  headerTitle: 'Поддержка',
  
  // Подзаголовок в шапке
  headerSubtitle: 'Онлайн'
}
```

### Дополнительные опции

```javascript
{
  // Аватар бота (URL изображения)
  botAvatar: null,
  
  // Аватар пользователя (URL изображения)
  userAvatar: null,
  
  // Включить анимации
  enableAnimations: true,
  
  // Показывать временные метки
  showTimestamp: true,
  
  // Показывать аватары
  showAvatar: true,
  
  // Включить звуковые уведомления
  enableSound: false,
  
  // Z-index виджета
  zIndex: 999999
}
```

## 🎨 Готовые темы

### Тема 1: Минимализм (По умолчанию)

```javascript
new AISupportWidget({
  apiKey: 'your-key',
  apiUrl: 'https://your-api.com',
  primaryColor: '#4F46E5',
  secondaryColor: '#FFFFFF',
  botMessageBg: '#F3F4F6',
  fontSize: '14px',
  borderRadius: '12px'
});
```

### Тема 2: Темная

```javascript
new AISupportWidget({
  apiKey: 'your-key',
  apiUrl: 'https://your-api.com',
  primaryColor: '#10B981',
  secondaryColor: '#1F2937',
  textColor: '#F9FAFB',
  botMessageBg: '#374151',
  userMessageBg: '#10B981',
  borderRadius: '8px'
});
```

### Тема 3: Корпоративная

```javascript
new AISupportWidget({
  apiKey: 'your-key',
  apiUrl: 'https://your-api.com',
  primaryColor: '#DC2626',
  secondaryColor: '#FFFFFF',
  botMessageBg: '#FEE2E2',
  userMessageBg: '#DC2626',
  fontFamily: 'Georgia, serif',
  fontSize: '15px',
  borderRadius: '4px'
});
```

### Тема 4: Rounded & Colorful

```javascript
new AISupportWidget({
  apiKey: 'your-key',
  apiUrl: 'https://your-api.com',
  primaryColor: '#8B5CF6',
  secondaryColor: '#FAFAFA',
  botMessageBg: '#F3E8FF',
  userMessageBg: '#8B5CF6',
  borderRadius: '24px',
  buttonRadius: '50%',
  messageBubbleRadius: '20px',
  buttonSize: '70px'
});
```

### Тема 5: Компактная

```javascript
new AISupportWidget({
  apiKey: 'your-key',
  apiUrl: 'https://your-api.com',
  widgetWidth: '320px',
  widgetHeight: '500px',
  buttonSize: '50px',
  fontSize: '13px',
  borderRadius: '8px',
  messageBubbleRadius: '8px'
});
```

### Тема 6: Расширенная

```javascript
new AISupportWidget({
  apiKey: 'your-key',
  apiUrl: 'https://your-api.com',
  widgetWidth: '450px',
  widgetHeight: '700px',
  buttonSize: '70px',
  fontSize: '15px',
  borderRadius: '16px'
});
```

## 📱 Адаптация под бренд

### Пример 1: Синий корпоративный

```javascript
new AISupportWidget({
  apiKey: 'your-key',
  apiUrl: 'https://your-api.com',
  
  // Брендовые цвета
  primaryColor: '#0066CC',
  userMessageBg: '#0066CC',
  
  // Тексты
  headerTitle: 'Служба поддержки',
  headerSubtitle: 'Мы онлайн',
  welcomeMessage: 'Добро пожаловать! Как мы можем вам помочь?',
  buttonText: 'Помощь',
  placeholderText: 'Введите ваш вопрос...',
  
  // Позиция
  position: 'bottom-right',
  offsetX: '30px',
  offsetY: '30px'
});
```

### Пример 2: Зеленый эко-стиль

```javascript
new AISupportWidget({
  apiKey: 'your-key',
  apiUrl: 'https://your-api.com',
  
  primaryColor: '#059669',
  secondaryColor: '#F0FDF4',
  botMessageBg: '#D1FAE5',
  userMessageBg: '#059669',
  textColor: '#064E3B',
  
  borderRadius: '16px',
  messageBubbleRadius: '14px',
  
  headerTitle: 'Эко-поддержка',
  headerSubtitle: '🌱 Здесь для вас'
});
```

### Пример 3: Красный для службы поддержки

```javascript
new AISupportWidget({
  apiKey: 'your-key',
  apiUrl: 'https://your-api.com',
  
  primaryColor: '#EF4444',
  userMessageBg: '#EF4444',
  botMessageBg: '#FEE2E2',
  
  headerTitle: 'Срочная поддержка',
  headerSubtitle: 'Ответим за 1 минуту',
  buttonSize: '65px',
  
  enableSound: true
});
```

## 🎯 Кастомизация под разные страницы

### Главная страница (большой виджет)

```javascript
if (window.location.pathname === '/') {
  new AISupportWidget({
    apiKey: 'your-key',
    apiUrl: 'https://your-api.com',
    widgetWidth: '420px',
    widgetHeight: '650px',
    headerTitle: 'Привет! 👋',
    welcomeMessage: 'Добро пожаловать! Чем могу помочь?'
  });
}
```

### Страница оформления заказа (компактный)

```javascript
if (window.location.pathname.includes('/checkout')) {
  new AISupportWidget({
    apiKey: 'your-key',
    apiUrl: 'https://your-api.com',
    widgetWidth: '340px',
    widgetHeight: '480px',
    buttonSize: '50px',
    position: 'bottom-left',
    headerTitle: 'Помощь с заказом',
    primaryColor: '#10B981'
  });
}
```

## 💻 Программное изменение стиля

### Изменение цвета динамически

```javascript
const widget = new AISupportWidget({
  apiKey: 'your-key',
  apiUrl: 'https://your-api.com'
});

// Позже изменить цвет
document.documentElement.style.setProperty('--aisup-primary', '#DC2626');
```

### Создание кнопки переключения темы

```javascript
const themes = {
  light: {
    primaryColor: '#4F46E5',
    secondaryColor: '#FFFFFF',
    textColor: '#1F2937',
    botMessageBg: '#F3F4F6'
  },
  dark: {
    primaryColor: '#10B981',
    secondaryColor: '#1F2937',
    textColor: '#F9FAFB',
    botMessageBg: '#374151'
  }
};

function switchTheme(theme) {
  const colors = themes[theme];
  document.documentElement.style.setProperty('--aisup-primary', colors.primaryColor);
  document.documentElement.style.setProperty('--aisup-secondary', colors.secondaryColor);
  document.documentElement.style.setProperty('--aisup-text', colors.textColor);
  document.documentElement.style.setProperty('--aisup-bot-message-bg', colors.botMessageBg);
}
```

## 📐 Responsive дизайн

### Адаптация под мобильные устройства

```javascript
const isMobile = window.innerWidth < 768;

new AISupportWidget({
  apiKey: 'your-key',
  apiUrl: 'https://your-api.com',
  
  // Меньшие размеры для мобильных
  widgetWidth: isMobile ? '100%' : '380px',
  widgetHeight: isMobile ? '100vh' : '600px',
  buttonSize: isMobile ? '55px' : '60px',
  fontSize: isMobile ? '16px' : '14px',
  
  // Для мобильных - без отступов
  offsetX: isMobile ? '0' : '20px',
  offsetY: isMobile ? '0' : '20px',
  borderRadius: isMobile ? '0' : '12px'
});
```

## 🔧 Расширенная кастомизация через CSS

Вы можете переопределить любые стили добавив свой CSS:

```css
/* Изменить тень кнопки */
.aisup-toggle-btn {
  box-shadow: 0 8px 32px rgba(79, 70, 229, 0.3) !important;
}

/* Изменить шрифт заголовка */
.aisup-header-title {
  font-weight: 700 !important;
  font-size: 18px !important;
}

/* Добавить градиент в сообщения */
.aisup-message-user .aisup-message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

/* Изменить анимацию появления */
.aisup-open .aisup-chat-window {
  animation: customSlideIn 0.4s ease !important;
}

@keyframes customSlideIn {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(50px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

## 🎨 Советы по дизайну

1. **Контраст**: Убедитесь что текст читаем на всех фонах
2. **Брендинг**: Используйте цвета вашего бренда для узнаваемости
3. **Размеры**: На мобильных используйте больший `fontSize` (16px+)
4. **Анимации**: Отключайте для производительности на слабых устройствах
5. **Доступность**: Проверьте контрастность цветов (WCAG AA)

## 📚 Дополнительные ресурсы

- [Основная документация](README.md)
- [Руководство по тестированию](TESTING_GUIDE.md)
- [Примеры интеграции](examples/)

---

**Совет**: Начните с одной из готовых тем и настройте под свои нужды!
