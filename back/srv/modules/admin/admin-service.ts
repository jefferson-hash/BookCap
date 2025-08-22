import { ApplicationService } from "@sap/cds";
import { validateAuthToken } from "../../middlewares/authMiddleware";
import createBook from "./utils/handlers/books/create-book";
import createAuthor from "./utils/handlers/authors/create-author";
import updateBook from "./utils/handlers/books/update-book";
import deleteBook from "./utils/handlers/books/delete-book";
import deleteAuthor from "./utils/handlers/authors/delete-author";
import updateAuthor from "./utils/handlers/authors/update-author";
import { submitOrder } from "./utils/handlers/books/order-books";

export default class BooksService extends ApplicationService {
  async init(): Promise<void> {
    const { ListOfBooks } = this.entities;
    // Middleware
    this.before(
      [
        "createBook",
        "updateBook",
        "deleteBook",
        "createAuthor",
        "updateAuthor",
        "deleteAuthor",
      ],
      (req) => validateAuthToken(req)
    );

    // Add some discount for overstocked books
    this.after("each", ListOfBooks, (book) => {
      if (book.stock > 111) book.title += ` -- 11% discount!`;
    });

    // Handlers Books
    this.on("createBook", createBook);
    this.on("updateBook", updateBook);
    this.on("deleteBook", deleteBook);
    this.on("submitOrder", submitOrder);
    // this.after("submitOrder", emitOrder);

    // Handlers Authors
    this.on("createAuthor", createAuthor);
    this.on("updateAuthor", updateAuthor);
    this.on("deleteAuthor", deleteAuthor);

    await super.init();
  }
}
