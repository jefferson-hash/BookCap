import cds from "@sap/cds";
import { verifyRefreshToken } from "../../../../services/token.service";

export default async function logoutHandler(req: any) {
    const { Users } = cds.entities("my.user");
    const cookies = req._?.req?.cookies;
    const refreshToken = cookies?.["refresh-token"];

    // Si el token de refresco existe, elimínalo de la base de datos
    if (refreshToken) {
        const decodedObj = verifyRefreshToken(refreshToken);
        if (decodedObj && 'ID' in decodedObj) {
            await cds.run(
                UPDATE(Users).set({ refreshToken: null }).where({ ID: decodedObj.ID })
            );
        }
    }

    // Borrar las cookies del navegador
    req._.res.clearCookie("auth-token");
    req._.res.clearCookie("refresh-token");

    return { message: "Logout successful" };
}