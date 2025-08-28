import cds from "@sap/cds";

export default async function getChatsUserHandler(req: any) {
  const { Chats } = cds.entities("my.chat");

  const userId = req.user?.ID;

  if (!userId) {
    req.error(401, "Usuario no autenticado.");
    return;
  }

  // Construir expresión segura
  const expr = cds.parse.expr(
    `user1_ID = '${userId}' OR user2_ID = '${userId}'`
  );

  // Ejecutar consulta
  const chats = await SELECT.from(Chats)
    .columns(["ID", "createdAt", "user1_ID", "user2_ID"])
    .where(expr);

  if (!chats.length) {
    return [];
  }

  // Mapear para devolver solo el otro usuario
  const result = chats.map((chat: any) => {
    const otherUser = chat.user1_ID === userId ? chat.user2_ID : chat.user1_ID;
    return {
      ID: chat.ID,
      createdAt: chat.createdAt,
      otherUser,
    };
  });

  return result;
}
