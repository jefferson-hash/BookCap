import cds from "@sap/cds";

export default async function deleteAuthor(req: any) {
  const { UserRoles } = cds.entities("my.user");
  const { Authors } = cds.entities("sap.capire.bookshop");
  const { idAuthor } = req.data;

  const roleId = req.user?.role;

  if (!roleId) {
    return req.error(401, "User not autenticated");
  }

  //validate user is admin
  const roleUSer = await SELECT.one
    .from(UserRoles)
    .where({ ID: roleId, name: "admin" });

  const isAdmin = !!roleUSer;

  if (!isAdmin) {
    return req.error(403, "The user is not authorized to perform this action");
  }

  // Validate book exist
  const bookExist = await SELECT.one.from(Authors).where({ ID: idAuthor });

  if (!bookExist) {
    return req.error(404, `No book found with ID: ${idAuthor}`);
  }

  // Delete books
  await cds.run(DELETE.from(Authors).where({ ID: idAuthor }));

  return `Book '${idAuthor}' deleted successfully.`;
}
