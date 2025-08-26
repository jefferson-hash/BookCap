import cds from "@sap/cds";

export default async function createAuthor(req: any) {
  const { UserRoles } = cds.entities("my.user");

  const { Authors } = cds.entities("sap.capire.bookshop");

  let {
    nameAuthor,
    imageUrl,
    biography,
    dateOfBirth,
    dateOfDeath,
    placeOfBirth,
    placeOfDeath,
  } = req.data;

  // role extracted from the token
  const roleId = req.user?.role;

  if (!roleId) {
    return req.error(401, "User not autenticated");
  }

  //Valñidate user is author
  const roleUser = await SELECT.one
    .from(UserRoles)
    .where({ ID: roleId, name: "admin" });

  // AuthorID
  const authorRoleRow = await SELECT.one
    .from(Authors)
    .where({ name: nameAuthor });
  if (authorRoleRow) {
    return req.error(404, `Author '${nameAuthor}' already exist`);
  }

  // transform to boolean

  const isAdmin = !!roleUser;

  if (!isAdmin) {
    return req.error(403, "The user is not authorized to perform this action");
  }
  await cds.run(
    INSERT.into(Authors).entries({
      name: nameAuthor,
      dateOfBirth,
      imageUrl,
      biography,
      dateOfDeath,
      placeOfBirth,
      placeOfDeath,
    })
  );

  return `Author '${nameAuthor}' created successfully.`;
}
