import cds from "@sap/cds";
import cookieParser from "cookie-parser";

cds.on("bootstrap", (app) => {
  app.use(cookieParser());
});
