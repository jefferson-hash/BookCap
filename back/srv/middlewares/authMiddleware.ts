import refreshTokenHandler from "../modules/users/utils/handlers/refreshToken-user";
import { jwtVerify } from "../services/token.service";

export async function validateAuthToken(req: any) {
  try {
    const cookies = req._?.req?.cookies;
    let authToken = cookies?.["auth-token"];

    if (!authToken) {
      // No hay token -> intento refrescar

      authToken = await refreshTokenHandler(req);
      if (!authToken) {
        return req.error(401, "Authorization token missing");
      }
    }

    // Verificamos el token actual o el renovado
    let decoded = jwtVerify(authToken);

    if (!decoded) {
      // Token inválido -> intento refrescar
      authToken = await refreshTokenHandler(req);
      if (!authToken) {
        return req.error(401, "Invalid token");
      }

      decoded = jwtVerify(authToken);
      if (!decoded) {
        return req.error(401, "Invalid token after refresh");
      }
    }

    // Guardamos usuario en req
    req.user = decoded;
    return req.user;
  } catch (err) {
    console.error("Auth validation error:", err);
    return req.error(401, "Unauthorized");
  }
}
