import { validateUser } from "../validateUser/validators-user";
import { hashPassword } from "../../../../services/token.service";
import cds from "@sap/cds";

export default async function registerHandler(req: any) {
  const { Users, UserRoles } = cds.entities("my.user");

  let { nameUser, email, phone, password, confirmPasswor, userRole } = req.data;

  // Validate user data
  const errors = await validateUser(req, Users);
  if (errors.length > 0) {
    return req.error(400, errors.join("; "));
  }

  // Validate password confirmation
  if (password !== confirmPasswor) {
    return req.error(400, "Passwords do not match");
  }

  // Assign default role if not provided
  if (!userRole) {
    const defaultRole = await cds.run(
      SELECT.one.from(UserRoles).where({ name: "reader" }),
    );

    if (!defaultRole) {
      return req.error(500, "Default role 'reader' not found.");
    }
    userRole = defaultRole.ID.toString();
  } else {
    const roleFound = await cds.run(
      SELECT.one.from(UserRoles).where({ name: userRole }),
    );
    if (!roleFound) {
      return req.error(400, `Role '${userRole}' not found.`);
    }
    userRole = roleFound.ID.toString();
  }

  // Hash password
  if (password) {
    const hashed = await hashPassword(password);
    if (!hashed) {
      return req.error(500, "Failed to hash password");
    }
    password = hashed;
  }

  // Insert user
  await cds.run(
    INSERT.into(Users).entries({
      name: nameUser,
      email,
      phone,
      password,
      role: { ID: userRole },
      isActive: true,
      createdAt: new Date().toISOString(),
    }),
  );

  return `User '${nameUser}' created successfully.`;
}
