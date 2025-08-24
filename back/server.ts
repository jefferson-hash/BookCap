import cds from "@sap/cds";
import cors from "cors";
import cookieParser from "cookie-parser";

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
