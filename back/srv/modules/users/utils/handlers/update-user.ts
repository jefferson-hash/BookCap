import { hashPassword } from "../../../../services/token.service";

export default async function updateHandler(req: any, UserRoles: any) {
  let { IdUser, nameUser, email, phone, password, userRole, isActive } =
    req.data;

  const loggedInUserId = req.user.ID;
  let userToUpdateId = IdUser ? IdUser : loggedInUserId;

  const roleId = req.user?.role;

  if (!loggedInUserId || !roleId) {
    return req.error(401, "User not authenticated");
  }

  // Verificar si el usuario es admin
  const adminRoleRow = await SELECT.one
    .from(UserRoles)
    .where({ ID: roleId, name: "admin" });

  const isAdmin = !!adminRoleRow;

  if (!isAdmin && loggedInUserId !== userToUpdateId) {
    return req.error(
      403,
      "Forbidden: No tienes permiso para actualizar este usuario.",
    );
  }

  // Validar confirmación de contraseña
  if (password !== req.data.confirmPasswor) {
    return req.error(400, "Passwords do not match");
  }

  // Construir objeto de actualización
  const updateData: any = {};
  if (nameUser) updateData.name = nameUser;
  if (email) updateData.email = email;
  if (phone) updateData.phone = phone;
  if (isActive !== undefined) updateData.isActive = isActive;
  updateData.updatedAt = new Date().toISOString();

  if (password) {
    updateData.password = await hashPassword(password);
  }

  if (userRole) {
    if (!isAdmin) {
      return req.error(403, "Forbidden: No puedes cambiar tu rol de usuario.");
    }
    const newRole = await SELECT.one.from(UserRoles).where({ name: userRole });
    if (!newRole) {
      return req.error(400, `Role '${userRole}' not found.`);
    }
    updateData.role = { ID: newRole.ID };
  }

  // Ejecutar la actualización
  await UPDATE("my.user.Users").set(updateData).where({ ID: userToUpdateId });

  return `User with ID '${userToUpdateId}' updated successfully.`;
}
