package io.polydev.aisupport

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

/**
 * SDK Configuration
 */
data class AISUPConfig(
    val apiKey: String,
    val apiUrl: String,
    val wsUrl: String = apiUrl,
    val userName: String = "Guest"
)

/**
 * Message model
 */
@Serializable
data class Message(
    @SerialName("_id") val id: String,
    val chat: String,
    val content: String,
    val sender: MessageSender,
    val senderName: String? = null,
    val attachments: List<Attachment>? = null,
    val createdAt: String,
    val updatedAt: String
)

@Serializable
enum class MessageSender {
    @SerialName("user") USER,
    @SerialName("bot") BOT,
    @SerialName("operator") OPERATOR
}

/**
 * Attachment model
 */
@Serializable
data class Attachment(
    val type: AttachmentType,
    val url: String,
    val name: String,
    val size: Int? = null,
    val mimeType: String? = null
)

@Serializable
enum class AttachmentType {
    @SerialName("image") IMAGE,
    @SerialName("video") VIDEO,
    @SerialName("file") FILE
}

/**
 * Chat model
 */
@Serializable
data class Chat(
    @SerialName("_id") val id: String,
    val chatId: String,
    val platform: String,
    val status: ChatStatus,
    val mode: ChatMode,
    val userName: String? = null,
    val createdAt: String,
    val updatedAt: String
)

@Serializable
enum class ChatStatus {
    @SerialName("active") ACTIVE,
    @SerialName("closed") CLOSED,
    @SerialName("pending") PENDING
}

@Serializable
enum class ChatMode {
    @SerialName("bot") BOT,
    @SerialName("operator") OPERATOR
}

/**
 * API Responses
 */
@Serializable
data class InitResponse(
    val success: Boolean,
    val chatId: String,
    val chat: Chat,
    val welcomeMessage: String? = null
)

@Serializable
data class SendMessageResponse(
    val success: Boolean,
    val message: Message
)

@Serializable
data class MessagesResponse(
    val success: Boolean,
    val messages: List<Message>,
    val hasMore: Boolean
)

@Serializable
data class UploadResponse(
    val success: Boolean,
    val attachment: Attachment
)

/**
 * Connection status
 */
enum class ConnectionStatus {
    DISCONNECTED,
    CONNECTING,
    CONNECTED,
    ERROR
}

/**
 * SDK Exceptions
 */
sealed class AISUPException(message: String) : Exception(message) {
    class NotInitialized : AISUPException("Chat not initialized. Call init() first.")
    class NetworkError(cause: Throwable) : AISUPException("Network error: ${cause.message}")
    class InvalidResponse : AISUPException("Invalid response from server")
    class ServerError(message: String) : AISUPException("Server error: $message")
    class SocketError(message: String) : AISUPException("Socket error: $message")
}
