import cds from "@sap/cds";

export const submitOrder = async (req: any) => {
  const { Books } = cds.entities("sap.capire.bookshop");
  let { book: id, quantity } = req.data || {};

  // Fetch only the stock column for the given book
  let book = await SELECT.one.from(Books, id).columns("stock");
  console.log("BOOK: ", book);

  console.log("SUBMIT ORDER: ", req.data);

  // Validate input data
  if (!book) return req.error(404, `Book #${id} doesn't exist`);
  if (quantity < 1) return req.error(400, `quantity has to be 1 or more`);
  if (quantity > book.stock)
    return req.error(409, `${quantity} exceeds stock for book #${id}`);

  // Update stock in database and return the updated stock value
  await UPDATE(Books, id).with({ stock: (book.stock -= quantity) });

  return { stock: book.stock, book: id, quantity };
};

// export const emitOrder = async (req: any) => {
//   const { book, quantity } = req._?.res || {};

//   console.log("EMIT ORDER: ", { book, quantity });

//   if (!book || !quantity) {
//     console.warn("No data to emit");
//     return;
//   }

//   await req.emit("OrderedBook", { book, quantity, buyer: req.user?.ID });
// };
