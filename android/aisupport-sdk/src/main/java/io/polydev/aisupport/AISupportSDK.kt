package io.polydev.aisupport

import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException

/**
 * Main entry point for AISup SDK
 * Combines API and Socket clients for easy usage
 */
class AISUPSDK(val config: AISUPConfig) {
    
    val api = AISUPAPIClient(config)
    val socket = AISUPSocketClient(config)
    
    private val _messages = MutableStateFlow<List<Message>>(emptyList())
    val messages: StateFlow<List<Message>> = _messages.asStateFlow()
    
    private val _connectionStatus = MutableStateFlow(ConnectionStatus.DISCONNECTED)
    val connectionStatus: StateFlow<ConnectionStatus> = _connectionStatus.asStateFlow()
    
    var onMessage: ((Message) -> Unit)? = null
    var onChatUpdated: ((Chat) -> Unit)? = null
    var onError: ((Throwable) -> Unit)? = null
    
    val isInitialized: Boolean
        get() = api.chatId != null
    
    val isConnected: Boolean
        get() = socket.isConnected
    
    init {
        setupSocketCallbacks()
    }
    
    /**
     * Initialize chat and connect to socket
     */
    suspend fun start(): Unit = withContext(Dispatchers.IO) {
        val response = api.initialize()
        
        // Load message history
        val messagesResponse = api.getMessages()
        _messages.value = messagesResponse.messages
        
        // Connect socket
        socket.connect()
        
        // Wait for connection and join chat
        suspendCancellableCoroutine { continuation ->
            var completed = false
            
            socket.onConnect = {
                if (!completed) {
                    socket.joinChat(response.chatId) { result ->
                        if (!completed) {
                            completed = true
                            result.fold(
                                onSuccess = { continuation.resume(Unit) },
                                onFailure = { continuation.resumeWithException(it) }
                            )
                        }
                    }
                }
            }
            
            socket.onError = { error ->
                if (!completed) {
                    completed = true
                    continuation.resumeWithException(error)
                }
            }
            
            // Timeout
            CoroutineScope(Dispatchers.IO).launch {
                delay(10000)
                if (!completed) {
                    completed = true
                    continuation.resumeWithException(
                        AISUPException.SocketError("Connection timeout")
                    )
                }
            }
        }
    }
    
    /**
     * Send a message
     */
    suspend fun sendMessage(content: String): Message {
        val response = api.sendMessage(content)
        addMessage(response.message)
        return response.message
    }
    
    /**
     * Load message history
     */
    suspend fun loadMessages(limit: Int = 50): List<Message> {
        val response = api.getMessages(limit)
        _messages.value = response.messages
        return response.messages
    }
    
    /**
     * Disconnect and cleanup
     */
    fun stop() {
        socket.leaveChat()
        socket.disconnect()
    }
    
    private fun setupSocketCallbacks() {
        socket.onMessage = { message ->
            addMessage(message)
            onMessage?.invoke(message)
        }
        
        socket.onChatUpdated = { chat ->
            onChatUpdated?.invoke(chat)
        }
        
        socket.onStatusChange = { status ->
            _connectionStatus.value = status
        }
        
        socket.onError = { error ->
            onError?.invoke(error)
        }
    }
    
    private fun addMessage(message: Message) {
        val currentMessages = _messages.value.toMutableList()
        if (currentMessages.none { it.id == message.id }) {
            currentMessages.add(message)
            currentMessages.sortBy { it.createdAt }
            _messages.value = currentMessages
        }
    }
}
