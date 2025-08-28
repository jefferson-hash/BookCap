import cds from "@sap/cds";

export default async function createChatHandler(req: any) {
  const { Chats } = cds.entities("my.chat");
  const { Users } = cds.entities("my.user");

  const userId = req.user?.ID;
  const { user2 } = req.data;

  if (!userId) return req.error(401, "Usuario no autenticado.");
  if (!user2)
    return req.error(
      400,
      "Debes especificar un usuario con quien chatear (user2)."
    );
  if (userId === user2)
    return req.error(400, "No puedes crear un chat contigo mismo.");

  const existsUser2 = await SELECT.one.from(Users).where({ ID: user2 });
  if (!existsUser2)
    return req.error(404, `El usuario destino (${user2}) no existe.`);

  // ✅ CQN template literal compatible con TypeScript y SQLite
  const existing = await SELECT.one.from(Chats).where`
    (user1_ID = ${userId} AND user2_ID = ${user2}) 
    OR (user1_ID = ${user2} AND user2_ID = ${userId})
  `;

  if (existing) {
    return {
      chatId: existing.ID,
      message: "Ya existe un chat entre los usuarios",
    };
  }

  const [newChat] = await INSERT.into(Chats)
    .entries({
      user1_ID: userId,
      user2_ID: user2,
      createdAt: new Date(),
    })
    .columns("ID");

  return { chatId: newChat.ID, message: "Chat creado exitosamente" };
}
