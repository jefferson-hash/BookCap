import cds from "@sap/cds";
import cors from "cors";
import cookieParser from "cookie-parser";

import { initChatSocket } from "./srv/modules/chat/chat.socket";

// Apply general middlewares for HTTP/OData traffic
cds.on("bootstrap", (app) => {
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

// Attach Socket.IO to the CAP server after it starts listening
cds.on("listening", ({ server, url }: any) => {
  console.log("Servidor CAP escuchando.......");

  initChatSocket(server);

  console.log("Servidor Socket.IO listo......");
});
