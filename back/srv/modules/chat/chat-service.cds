using my.chat as chat from '../../../db/chat-schema';
using my.user as user from '../../../db/user-schema';

service ChatService @(path: '/chat') {

    // === Entidades expuestas vía OData ===
    entity Chats    as
        projection on chat.Chats {
            ID,
            user1,
            user2,
            createdAt,
            updatedAt,
            messages
        };

    entity Messages as
        projection on chat.Messages {
            ID,
            chat,
            sender,
            content,
            isRead,
            createdAt
        };

    // === Acciones personalizadas ===

    // Crear un nuevo chat entre dos usuarios
    action createChat(user1: UUID, user2: UUID)                             returns UUID;

    // Enviar mensaje dentro de un chat
    action sendMessage(chatId: UUID, senderId: UUID, content: String(1000)) returns UUID;

    // Marcar mensajes como leídos
    action markAsRead(chatId: UUID, userId: UUID)                           returns Integer;

    action getChatsUser()                                                   returns many Chats;


}
