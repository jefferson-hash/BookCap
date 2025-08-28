import cds from "@sap/cds";
import { validateAuthToken } from "../../middlewares/authMiddleware";
import createChatHandler from "./utils/handlers/cheate-chat-handlers";
import getChatsUserHandler from "./utils/handlers/get-chat-handler";
import markAsReadHandler from "./utils/handlers/mark-read-chat-hadlers";

module.exports = class ChatService extends cds.ApplicationService {
  async init() {
    // middleware
    this.before(
      ["createChat", "getChatsUser", "getAllUsers", "markAsRead"],
      (req) => validateAuthToken(req)
    );

    // Acción para crear chat
    this.on("createChat", async (req) => createChatHandler(req));

    //Traer chats relacionados con id en token
    this.on("getChatsUser", async (req) => getChatsUserHandler(req));
    // Acción para marcar mensajes como leídos
    this.on("markAsRead", async (req) => markAsReadHandler(req));

    await super.init();
  }
};
