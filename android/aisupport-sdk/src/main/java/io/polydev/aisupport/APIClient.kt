package io.polydev.aisupport

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.File
import java.util.concurrent.TimeUnit

/**
 * AISUP API Client for Android
 * Handles REST API communication with AISup backend
 */
class AISUPAPIClient(private val config: AISUPConfig) {
    
    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()
    
    private val json = Json { 
        ignoreUnknownKeys = true 
        isLenient = true
    }
    
    var chatId: String? = null
        private set
    
    fun setChatId(id: String) {
        chatId = id
    }
    
    /**
     * Initialize a new chat session
     */
    suspend fun initialize(): InitResponse = withContext(Dispatchers.IO) {
        val body = buildString {
            append("{")
            append("\"userName\":\"${config.userName}\"")
            chatId?.let { append(",\"chatId\":\"$it\"") }
            append("}")
        }
        
        val request = Request.Builder()
            .url("${config.apiUrl}/api/integration/init")
            .addHeader("Content-Type", "application/json")
            .addHeader("X-API-Key", config.apiKey)
            .post(body.toRequestBody("application/json".toMediaType()))
            .build()
        
        val response = client.newCall(request).execute()
        if (!response.isSuccessful) {
            throw AISUPException.ServerError("HTTP ${response.code}")
        }
        
        val responseBody = response.body?.string() 
            ?: throw AISUPException.InvalidResponse()
        
        val result = json.decodeFromString<InitResponse>(responseBody)
        chatId = result.chatId
        result
    }
    
    /**
     * Send a text message
     */
    suspend fun sendMessage(
        content: String, 
        attachments: List<Attachment>? = null
    ): SendMessageResponse = withContext(Dispatchers.IO) {
        val currentChatId = chatId ?: throw AISUPException.NotInitialized()
        
        val body = buildString {
            append("{")
            append("\"chatId\":\"$currentChatId\",")
            append("\"content\":\"${content.replace("\"", "\\\"")}\"")
            attachments?.let {
                append(",\"attachments\":${json.encodeToString(it)}")
            }
            append("}")
        }
        
        val request = Request.Builder()
            .url("${config.apiUrl}/api/integration/send-message")
            .addHeader("Content-Type", "application/json")
            .addHeader("X-API-Key", config.apiKey)
            .post(body.toRequestBody("application/json".toMediaType()))
            .build()
        
        val response = client.newCall(request).execute()
        if (!response.isSuccessful) {
            throw AISUPException.ServerError("HTTP ${response.code}")
        }
        
        val responseBody = response.body?.string() 
            ?: throw AISUPException.InvalidResponse()
        
        json.decodeFromString<SendMessageResponse>(responseBody)
    }
    
    /**
     * Get message history
     */
    suspend fun getMessages(
        limit: Int = 50, 
        before: String? = null
    ): MessagesResponse = withContext(Dispatchers.IO) {
        val currentChatId = chatId ?: throw AISUPException.NotInitialized()
        
        val urlBuilder = StringBuilder("${config.apiUrl}/api/integration/messages")
        urlBuilder.append("?chatId=$currentChatId")
        urlBuilder.append("&limit=$limit")
        before?.let { urlBuilder.append("&before=$it") }
        
        val request = Request.Builder()
            .url(urlBuilder.toString())
            .addHeader("X-API-Key", config.apiKey)
            .get()
            .build()
        
        val response = client.newCall(request).execute()
        if (!response.isSuccessful) {
            throw AISUPException.ServerError("HTTP ${response.code}")
        }
        
        val responseBody = response.body?.string() 
            ?: throw AISUPException.InvalidResponse()
        
        json.decodeFromString<MessagesResponse>(responseBody)
    }
    
    /**
     * Upload a file
     */
    suspend fun uploadFile(
        file: File, 
        mimeType: String
    ): UploadResponse = withContext(Dispatchers.IO) {
        val currentChatId = chatId ?: throw AISUPException.NotInitialized()
        
        val requestBody = MultipartBody.Builder()
            .setType(MultipartBody.FORM)
            .addFormDataPart("chatId", currentChatId)
            .addFormDataPart(
                "file",
                file.name,
                file.readBytes().toRequestBody(mimeType.toMediaType())
            )
            .build()
        
        val request = Request.Builder()
            .url("${config.apiUrl}/api/integration/upload")
            .addHeader("X-API-Key", config.apiKey)
            .post(requestBody)
            .build()
        
        val response = client.newCall(request).execute()
        if (!response.isSuccessful) {
            throw AISUPException.ServerError("HTTP ${response.code}")
        }
        
        val responseBody = response.body?.string() 
            ?: throw AISUPException.InvalidResponse()
        
        json.decodeFromString<UploadResponse>(responseBody)
    }
    
    /**
     * Mark messages as read
     */
    suspend fun markAsRead(): Unit = withContext(Dispatchers.IO) {
        val currentChatId = chatId ?: return@withContext
        
        val body = "{\"chatId\":\"$currentChatId\"}"
        
        val request = Request.Builder()
            .url("${config.apiUrl}/api/integration/mark-read")
            .addHeader("Content-Type", "application/json")
            .addHeader("X-API-Key", config.apiKey)
            .post(body.toRequestBody("application/json".toMediaType()))
            .build()
        
        client.newCall(request).execute()
    }
}
