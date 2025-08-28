import cds from "@sap/cds";
import {
  verifyRefreshToken,
  generateToken,
} from "../../../../services/token.service";

export default async function refreshTokenHandler(req: any) {
  const { Users } = cds.entities("my.user");

  const cookies = req.req?.cookies;
  const refreshToken = cookies?.["refresh-token"];

  if (!refreshToken) {
    return null;
  }

  const decodedObj = verifyRefreshToken(refreshToken);
  if (!decodedObj || typeof decodedObj !== "object" || !("ID" in decodedObj)) {
    return req.error(401, "Invalid or expired refresh token");
  }

  const user = await cds.run(
    SELECT.one.from(Users).where({ ID: decodedObj.ID, refreshToken })
  );

  if (!user) {
    return req.error(401, "Refresh token not found for this user");
  }

  const newAccessToken = generateToken({
    ID: user.ID,
    email: user.email,
    role: user.role_ID,
  });

  req.res.cookie("auth-token", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 900000, // 15 minutes
  });

  return newAccessToken;
}
