import cds from "@sap/cds";
import {
  validatePassword,
  generateToken,
  generateRefreshToken,
} from "../../../../services/token.service";

export default async function loginHandler(req: any) {
  // cast seguro de entities
  const entities = cds.entities("my.user");
  const { Users } = entities;

  const { email, password } = req.data || req.body;
  console.log("Body recibido:", req.body);
  if (!email || !password) {
    return req.error(400, "Email and password are required");
  }

  // Validate user credentials
  const user = await cds.run(SELECT.one.from(Users).where({ email }));

  if (!user || !(await validatePassword(password, user.password))) {
    return req.error(401, "Invalid credentials");
  }

  // Generate tokens
  const token = generateToken({
    ID: user.ID,
    email: user.email,
    role: user.role_ID,
  });
  const refreshToken = generateRefreshToken({
    ID: user.ID,
    email: user.email,
    role: user.role_ID,
  });

  // Update user with refresh token
  await cds.run(UPDATE(Users).set({ refreshToken }).where({ ID: user.ID }));

  // Set cookies
  req._.res.cookie("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 900_000,
  });

  req._.res.cookie("refresh-token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return {
    message: "Login successful",
    user,
  };
}
