# AISup SDK ProGuard rules

# Keep models for serialization
-keep class io.polydev.aisupport.** { *; }
-keepclassmembers class io.polydev.aisupport.** { *; }

# Kotlinx serialization
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.AnnotationsKt

-keepclassmembers class kotlinx.serialization.json.** {
    *** Companion;
}
-keepclasseswithmembers class kotlinx.serialization.json.** {
    kotlinx.serialization.KSerializer serializer(...);
}

# OkHttp
-dontwarn okhttp3.**
-dontwarn okio.**

# Socket.IO
-dontwarn io.socket.**
