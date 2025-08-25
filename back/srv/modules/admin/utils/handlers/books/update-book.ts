import cds from "@sap/cds";

export default async function updateBook(req: any) {
  const { UserRoles } = cds.entities("my.user");

  const { Genres, Books, Authors } = cds.entities("sap.capire.bookshop");

  let {
    idBook,
    title,
    descr,
    genre,
    author,
    stock,
    price,
    imageUrl,
    currency_code,
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
  const validateBook = await SELECT.one.from(Books).where({ ID: idBook });
  if (!validateBook) {
    return req.error(404, `Book '${idBook}' not found`);
  }

  // genreID
  const genreRow = await SELECT.one.from(Genres).where({ name: genre });
  if (!genreRow) {
    return req.error(404, `Genre '${genre}' not found`);
  }

  // AuthorID
  const authorRow = await SELECT.one.from(Authors).where({ name: author });
  if (!authorRow) {
    return req.error(404, `Author '${author}' not found`);
  }

  // transform to boolean

  const isAdmin = !!roleUser;

  if (!isAdmin) {
    return req.error(403, "The user is not authorized to perform this action");
  }

  const updateData: any = {};

  if (title) updateData.title = title;
  if (descr) updateData.descr = descr;
  if (genreRow) updateData.genre_ID = genreRow.ID;
  if (authorRow) updateData.author_ID = authorRow.ID;
  if (stock !== undefined) updateData.stock = stock;
  if (price !== undefined) updateData.price = price;
  if (imageUrl) updateData.imageUrl = imageUrl;
  if (currency_code) updateData.currency_code = currency_code;

  await cds.run(UPDATE(Books).set(updateData).where({ ID: idBook }));

  return `Book '${title}' update successfully.`;
}
