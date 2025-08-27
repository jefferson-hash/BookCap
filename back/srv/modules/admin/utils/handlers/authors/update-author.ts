import cds from "@sap/cds";

export default async function updateAuthor(req: any) {
  const { UserRoles } = cds.entities("my.user");

  const { Authors } = cds.entities("sap.capire.bookshop");

  let {
    idAuthor,
    nameAuthor,
    dateOfBirth,
    dateOfDeath,
    placeOfBirth,
    placeOfDeath,
    biography,
    imageUrl,
  } = req.data;

  // role extracted from the token
  const roleId = req.user?.role;

  if (!roleId) {
    return req.error(401, "User not autenticated");
  }

  //Valñidate user is admin
  const roleUser = await SELECT.one
    .from(UserRoles)
    .where({ ID: roleId, name: "admin" });

  //Valida idBook
  const validateBook = await SELECT.one.from(Authors).where({ ID: idAuthor });
  if (!validateBook) {
    return req.error(404, `Book '${idAuthor}' not found`);
  }

  // transform to boolean

  const isAdmin = !!roleUser;

  if (!isAdmin) {
    return req.error(403, "The user is not authorized to perform this action");
  }

  const updateData: any = {};

  if (nameAuthor) updateData.name = nameAuthor;
  if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
  if (dateOfDeath) updateData.dateOfDeath = dateOfDeath;
  if (placeOfBirth) updateData.placeOfBirth = placeOfBirth;
  if (placeOfDeath) updateData.placeOfDeath = placeOfDeath;
  if(imageUrl) updateData.imageUrl = imageUrl;
  if (biography) updateData.biography = biography; 

  await cds.run(UPDATE(Authors).set(updateData).where({ ID: idAuthor }));

  return `Book '${idAuthor}' update successfully.`;
}
