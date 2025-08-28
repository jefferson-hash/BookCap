// chat-socket.ts
import { Server as SocketIOServer } from "socket.io";
import cds from "@sap/cds";

export function initChatSocket(server: any) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*", // Permite todos los orígenes para desarrollo
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log(`⚡ Cliente conectado: ${socket.id}`);

    socket.on("chatMessage", async (data) => {
      const { chat_ID, sender_ID, content } = data;

      await cds.run(
        INSERT.into("my.chat.Messages").entries({
          chat_ID,
          sender_ID,
          content,
          createdAt: new Date(),
        })
      );

      io.in(chat_ID).emit("chatMessage", {
        chat_ID,
        sender_ID,
        content,
        createdAt: new Date(),
      });
    });

    socket.on("joinChat", (chat_ID: string) => {
      socket.join(chat_ID);
      console.log(`🟢 Usuario ${socket.id} entró al chat ${chat_ID}`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Cliente desconectado: ${socket.id}`);
    });
  });

  return io; // 👈 ahora puedes usar el io fuera
}
