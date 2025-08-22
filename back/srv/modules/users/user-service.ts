import { ApplicationService } from "@sap/cds";
import loginHandler from "./utils/handlers/login-user";
import registerHandler from "./utils/handlers/register-user";
import refreshTokenHandler from "./utils/handlers/refreshToken-user";
import updateHandler from "./utils/handlers/update-user";
import { validateAuthToken } from "../../middlewares/authMiddleware";
import userMe from "./utils/handlers/me.-user";
import logoutHandler from "./utils/handlers/logout-user";

export default class UserService extends ApplicationService {
  async init(): Promise<void> {
    const { UserRoles } = this.entities("my.user");

    // middleware
    this.before(["updateUser","READ", "me"], (req) => validateAuthToken(req));
    // Handlers
    this.on("login", loginHandler);
    this.on("logout",logoutHandler);
    this.on("register", registerHandler);
    this.on("refreshToken", refreshTokenHandler);
    this.on("updateUser", (req) => updateHandler(req, UserRoles));

    //me user
     this.on("READ", "me", (userMe))

    await super.init();
  }
}
