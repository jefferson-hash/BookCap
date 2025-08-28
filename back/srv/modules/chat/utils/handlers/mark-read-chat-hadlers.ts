import cds from "@sap/cds";

export default async function markAsReadHandler(req: any) {
  const { Messages, Chats } = cds.entities("my.chat");

  const userId = req.user?.ID;
  const { chatId } = req.data;

  // 1. Validar autenticación
  if (!userId) {
    req.error(401, "Usuario no autenticado.");
    return;
  }

  // 2. Validar parámetros
  if (!chatId) {
    req.error(400, "chatId es requerido.");
    return;
  }

  // 3. Verificar que el usuario pertenezca al chat
  const chat = await SELECT.one.from(Chats).where({ ID: chatId });
  if (!chat || (chat.user1_ID !== userId && chat.user2_ID !== userId)) {
    req.error(403, "No tienes acceso a este chat.");
    return;
  }

  const updated = await UPDATE(Messages)
    .set({ isRead: true })
    .where({ chat_ID: chatId, sender_ID: { "<>": userId } });

  return { updated }; // número de filas actualizadas
}
