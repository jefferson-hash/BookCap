import cds from "@sap/cds";

export default async function deleteBook(req: any) {
  const { UserRoles } = cds.entities("my.user");
  const { Books } = cds.entities("sap.capire.bookshop");
  const { idBook } = req.data;

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
  const bookExist = await SELECT.one.from(Books).where({ ID: idBook });

  if (!bookExist) {
    return req.error(404, `No book found with ID: ${idBook}`);
  }

  // Delete books
  await cds.run(DELETE.from(Books).where({ ID: idBook }));

  return `Book '${idBook}' deleted successfully.`;
}
