import cds from "@sap/cds";

export default async function createBook(req: any) {
  const { UserRoles } = cds.entities("my.user");

  const { Genres, Books, Authors } = cds.entities("sap.capire.bookshop");

  let { title, descr, genre, author, stock, price, imageUrl, currency_code } =
    req.data;

  // role extracted from the token
  const roleId = req.user?.role;

  if (!roleId) {
    return req.error(401, "User not autenticated");
  }

  //Valñidate user is author
  const roleUser = await SELECT.one
    .from(UserRoles)
    .where({ ID: roleId, name: "admin" });

  // genreID
  const genreRow = await SELECT.one.from(Genres).where({ name: genre });
  if (!genreRow) {
    return req.error(404, `Genre '${genre}' not found`);
  }

  // AuthorID
  const authorRoleRow = await SELECT.one.from(Authors).where({ name: author });
  if (!authorRoleRow) {
    return req.error(404, `Author '${author}' not found`);
  }

  // transform to boolean

  const isAdmin = !!roleUser;

  if (!isAdmin) {
    return req.error(403, "The user is not authorized to perform this action");
  }
  await cds.run(
    INSERT.into(Books).entries({
      title: title,
      descr: descr,
      author_ID: authorRoleRow.ID,
      genre_ID: genreRow.ID,
      stock: stock,
      image: imageUrl,
      price: price,
      currency: { code: currency_code },
    })
  );

  return `Book '${title}' created successfully.`;
}
