# AISUP SDK for Android

Современная Kotlin библиотека для интеграции чата поддержки AISUP.

**Возможности:**
- ✅ Kotlin Coroutines (suspend functions)
- ✅ StateFlow / SharedFlow
- ✅ Jetpack Compose ready
- ✅ Flow collectors

## Установка

### Gradle (JitPack)

Добавьте репозиторий JitPack в `settings.gradle.kts`:

```kotlin
dependencyResolutionManagement {
    repositories {
        maven { url = uri("https://jitpack.io") }
    }
}
```

Добавьте зависимость в `build.gradle.kts`:

```kotlin
dependencies {
    implementation("com.github.polydev-io:aisup-widget:1.0.0")
}
```

## Использование

### Быстрый старт

```kotlin
import io.polydev.aisupport.*

val config = AISUPConfig(
    apiKey = "YOUR_API_KEY",
    apiUrl = "https://your-api.com"
)

val sdk = AISUPSDK(config)

// Callbacks
sdk.onMessage = { message ->
    Log.d("AISUP", "New message: ${message.content}")
}

sdk.onError = { error ->
    Log.e("AISup", "Error: ${error.message}")
}

// Запуск (в coroutine)
lifecycleScope.launch {
    try {
        sdk.start()
        Log.d("AISup", "Connected! Chat ID: ${sdk.api.chatId}")
    } catch (e: Exception) {
        Log.e("AISup", "Failed to start: ${e.message}")
    }
}

// Отправка сообщения
lifecycleScope.launch {
    val message = sdk.sendMessage("Привет!")
    Log.d("AISup", "Sent: ${message.content}")
}

// Не забудьте остановить при уничтожении
override fun onDestroy() {
    super.onDestroy()
    sdk.stop()
}
```

### Использование API клиента отдельно

```kotlin
val api = AISupportAPIClient(config)

lifecycleScope.launch {
    // Инициализация чата
    val initResponse = api.initialize()
    
    // Отправка сообщения
    val sendResponse = api.sendMessage("Hello!")
    
    // Получение истории
    val messages = api.getMessages(limit = 50)
    
    // Загрузка файла
    val file = File("/path/to/image.jpg")
    val uploadResponse = api.uploadFile(file, "image/jpeg")
}
```

### Использование Socket клиента отдельно

```kotlin
val socket = AISupportSocketClient(config)

socket.onConnect = {
    Log.d("AISup", "Connected!")
}

socket.onMessage = { message ->
    Log.d("AISup", "Message: ${message.content}")
}

socket.onTyping = { isTyping ->
    Log.d("AISup", "Operator typing: $isTyping")
}

// Подключение
socket.connect()

// Присоединение к чату
socket.joinChat(chatId) { result ->
    result.fold(
        onSuccess = { Log.d("AISup", "Joined chat: $it") },
        onFailure = { Log.e("AISup", "Error: ${it.message}") }
    )
}

// Отключение
socket.disconnect()
```

### Jetpack Compose интеграция

```kotlin
@Composable
fun ChatScreen() {
    val config = remember {
        AISupportConfig(
            apiKey = "YOUR_API_KEY",
            apiUrl = "https://your-api.com"
        )
    }
    
    val sdk = remember { AISupportSDK(config) }
    val messages by sdk.messages.collectAsState()
    val connectionStatus by sdk.connectionStatus.collectAsState()
    
    var inputText by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()
    
    LaunchedEffect(Unit) {
        sdk.start()
    }
    
    DisposableEffect(Unit) {
        onDispose { sdk.stop() }
    }
    
    Column(modifier = Modifier.fillMaxSize()) {
        // Connection status
        Text(
            text = "Status: $connectionStatus",
            modifier = Modifier.padding(8.dp)
        )
        
        // Messages
        LazyColumn(
            modifier = Modifier.weight(1f),
            reverseLayout = true
        ) {
            items(messages.reversed()) { message ->
                MessageItem(message)
            }
        }
        
        // Input
        Row(modifier = Modifier.padding(8.dp)) {
            TextField(
                value = inputText,
                onValueChange = { inputText = it },
                modifier = Modifier.weight(1f),
                placeholder = { Text("Сообщение...") }
            )
            
            Button(
                onClick = {
                    val text = inputText
                    inputText = ""
                    scope.launch {
                        sdk.sendMessage(text)
                    }
                }
            ) {
                Text("Отправить")
            }
        }
    }
}

@Composable
fun MessageItem(message: Message) {
    val isUser = message.sender == MessageSender.USER
    
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp),
        horizontalArrangement = if (isUser) Arrangement.End else Arrangement.Start
    ) {
        Surface(
            color = if (isUser) MaterialTheme.colorScheme.primary 
                    else MaterialTheme.colorScheme.surfaceVariant,
            shape = RoundedCornerShape(12.dp)
        ) {
            Text(
                text = message.content,
                modifier = Modifier.padding(12.dp),
                color = if (isUser) Color.White else Color.Unspecified
            )
        }
    }
}
```

## Требования

- Android API 21+
- Kotlin 1.8+
