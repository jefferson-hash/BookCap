import cds from "@sap/cds";
import cors from "cors";
import cookieParser from "cookie-parser";
import { initChatSocket } from "./srv/modules/chat/chat.socket";

cds.on("bootstrap", (app) => {
  // === Middlewares ===
  app.use(
    cors({
      origin: "http://localhost:4200",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );
  app.use(cookieParser());
});

// === Integrar socket.io después de que CAP arranque ===
cds.on("listening", (server: any) => {
  console.log("✅ CAP server escuchando...");
  initChatSocket(server);
});

