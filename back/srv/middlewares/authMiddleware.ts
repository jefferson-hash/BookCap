import { jwtVerify } from "../services/token.service";

export function validateAuthToken(req: any) {
  const cookies = req._?.req?.cookies;
  const authToken = cookies?.["auth-token"];

  if (!authToken) {
    return req.error(401, "Authorization token missing");
  }

  const decoded = jwtVerify(authToken);
  if (!decoded) {
    return req.error(401, "Invalid token");
  }

  req.user = decoded;
}
