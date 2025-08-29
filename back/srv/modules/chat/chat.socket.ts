// chat-socket.ts
import { Server as SocketIOServer } from "socket.io";
import cds from "@sap/cds";
import { parse } from "cookie";
import { validateAuthToken } from "../../middlewares/authMiddleware";

export function initChatSocket(server: any) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  // Middleware de auth para sockets
  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.request.headers.cookie;
      console.log("cookiesHeader: ", cookieHeader);

      if (!cookieHeader) {
        return next(new Error("No cookies present"));
      }

      const cookies = parse(cookieHeader);

      // simulamos la estructura que espera validateAuthToken
      const req: any = {
        _: { req: { cookies } },
        error: (c: number, m: string) => new Error(m),
      };

      const user = await validateAuthToken(req);

      if (!user) return next(new Error("Unauthorized"));

      // Guardamos en socket.data
      socket.data.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(
      `⚡ Cliente conectado: ${socket.id} - user: ${socket.data.user?.ID}`
    );

    socket.on("chatMessage", async (data) => {
      const { chat_ID, content } = data;
      const sender_ID = socket.data.user.ID; // Ahora viene del token

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
      console.log(
        `🟢 Usuario ${socket.id} (${socket.data.user?.ID}) entró al chat ${chat_ID}`
      );
    });

    socket.on("disconnect", () => {
      console.log(`❌ Cliente desconectado: ${socket.id}`);
    });
  });

  return io;
}
