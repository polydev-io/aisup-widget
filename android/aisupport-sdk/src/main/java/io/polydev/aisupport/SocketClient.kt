package io.polydev.aisupport

import io.socket.client.IO
import io.socket.client.Socket
import kotlinx.serialization.json.Json
import org.json.JSONObject
import java.net.URI

/**
 * AISUP Socket Client for Android
 * Handles real-time WebSocket communication with AISup backend
 */
class AISUPSocketClient(private val config: AISUPConfig) {
    
    private var socket: Socket? = null
    private var chatId: String? = null
    
    private val json = Json { 
        ignoreUnknownKeys = true 
        isLenient = true
    }
    
    var status: ConnectionStatus = ConnectionStatus.DISCONNECTED
        private set
    
    // Callbacks
    var onConnect: (() -> Unit)? = null
    var onDisconnect: ((String) -> Unit)? = null
    var onError: ((Throwable) -> Unit)? = null
    var onMessage: ((Message) -> Unit)? = null
    var onChatUpdated: ((Chat) -> Unit)? = null
    var onTyping: ((Boolean) -> Unit)? = null
    var onStatusChange: ((ConnectionStatus) -> Unit)? = null
    
    val isConnected: Boolean
        get() = status == ConnectionStatus.CONNECTED && socket?.connected() == true
    
    /**
     * Connect to WebSocket server
     */
    fun connect() {
        if (socket?.connected() == true) return
        
        setStatus(ConnectionStatus.CONNECTING)
        
        try {
            val options = IO.Options().apply {
                forceNew = true
                reconnection = true
                reconnectionAttempts = 5
                reconnectionDelay = 1000
                auth = mapOf("apiKey" to config.apiKey)
                extraHeaders = mapOf("X-API-Key" to listOf(config.apiKey))
            }
            
            socket = IO.socket(URI.create(config.wsUrl), options)
            setupEventListeners()
            socket?.connect()
        } catch (e: Exception) {
            setStatus(ConnectionStatus.ERROR)
            onError?.invoke(e)
        }
    }
    
    /**
     * Disconnect from WebSocket server
     */
    fun disconnect() {
        socket?.disconnect()
        socket = null
        setStatus(ConnectionStatus.DISCONNECTED)
    }
    
    /**
     * Join a chat room to receive messages
     */
    fun joinChat(chatId: String, callback: (Result<String>) -> Unit) {
        if (!isConnected) {
            callback(Result.failure(AISUPException.SocketError("Socket not connected")))
            return
        }
        
        this.chatId = chatId
        
        socket?.emit("integration_join", JSONObject().apply {
            put("chatId", chatId)
        }) { args ->
            val response = args.getOrNull(0) as? JSONObject
            val status = response?.optString("status")
            
            if (status == "ok") {
                val resultChatId = response?.optString("chatId") ?: chatId
                callback(Result.success(resultChatId))
            } else {
                val message = response?.optString("message") ?: "Failed to join chat"
                callback(Result.failure(AISUPException.SocketError(message)))
            }
        }
    }
    
    /**
     * Leave current chat room
     */
    fun leaveChat(callback: (() -> Unit)? = null) {
        val currentChatId = chatId ?: run {
            callback?.invoke()
            return
        }
        
        socket?.emit("integration_leave", JSONObject().apply {
            put("chatId", currentChatId)
        }) { _ ->
            this.chatId = null
            callback?.invoke()
        }
    }
    
    /**
     * Send typing indicator
     */
    fun sendTyping(isTyping: Boolean) {
        val currentChatId = chatId ?: return
        if (!isConnected) return
        
        socket?.emit("typing", JSONObject().apply {
            put("chatId", currentChatId)
            put("isTyping", isTyping)
        })
    }
    
    private fun setStatus(newStatus: ConnectionStatus) {
        status = newStatus
        onStatusChange?.invoke(newStatus)
    }
    
    private fun setupEventListeners() {
        socket?.on(Socket.EVENT_CONNECT) {
            setStatus(ConnectionStatus.CONNECTED)
            onConnect?.invoke()
            
            // Rejoin chat if we were in one
            chatId?.let { id ->
                joinChat(id) { }
            }
        }
        
        socket?.on(Socket.EVENT_DISCONNECT) { args ->
            setStatus(ConnectionStatus.DISCONNECTED)
            val reason = args.getOrNull(0)?.toString() ?: "Unknown reason"
            onDisconnect?.invoke(reason)
        }
        
        socket?.on(Socket.EVENT_CONNECT_ERROR) { args ->
            setStatus(ConnectionStatus.ERROR)
            val error = args.getOrNull(0) as? Exception 
                ?: Exception("Connection error")
            onError?.invoke(error)
        }
        
        socket?.on("message_added") { args ->
            try {
                val data = args.getOrNull(0) as? JSONObject ?: return@on
                val messageJson = data.getJSONObject("message").toString()
                val message = json.decodeFromString<Message>(messageJson)
                onMessage?.invoke(message)
            } catch (e: Exception) {
                onError?.invoke(e)
            }
        }
        
        socket?.on("chat_updated") { args ->
            try {
                val data = args.getOrNull(0) as? JSONObject ?: return@on
                val chatJson = data.getJSONObject("chat").toString()
                val chat = json.decodeFromString<Chat>(chatJson)
                onChatUpdated?.invoke(chat)
            } catch (e: Exception) {
                onError?.invoke(e)
            }
        }
        
        socket?.on("typing") { args ->
            try {
                val data = args.getOrNull(0) as? JSONObject ?: return@on
                val isTyping = data.getBoolean("isTyping")
                onTyping?.invoke(isTyping)
            } catch (e: Exception) {
                // Ignore typing errors
            }
        }
    }
}
