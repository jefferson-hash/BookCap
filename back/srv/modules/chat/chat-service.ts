import cds from "@sap/cds";

module.exports = class ChatService extends cds.ApplicationService {
  async init() {
    const { Chats, Messages } = this.entities("my.chat");

    // Acción para crear chat
    this.on("createChat", async (req) => {
      const { user1, user2 } = req.data;

      // Verificar si ya existe un chat entre estos dos usuarios
      const existing = await SELECT.one.from(Chats).where({
        user1_ID: user1,
        user2_ID: user2,
      });

      if (existing) return existing.ID;

      const newChat = await INSERT.into(Chats).entries({
        user1_ID: user1,
        user2_ID: user2,
      });

      return newChat.ID;
    });

    // Acción para enviar mensaje
    this.on("sendMessage", async (req) => {
      const { chatId, senderId, content } = req.data;

      const newMessage = await INSERT.into(Messages).entries({
        chat_ID: chatId,
        sender_ID: senderId,
        content,
        createdAt: new Date(),
      });

      return newMessage.ID;
    });

    // Acción para marcar mensajes como leídos
    this.on("markAsRead", async (req) => {
      const { chatId, senderId } = req.data;

      const updated = await UPDATE(Messages)
        .set({ isRead: true })
        .where({ chat: chatId, sender: { "<>": senderId } });

      return updated; // número de filas actualizadas
    });

    await super.init();
  }
};
