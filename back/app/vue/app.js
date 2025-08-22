axios.defaults.withCredentials = true;
const $ = (sel) => document.querySelector(sel);
const GET = (url) => axios.get("" + url);
const POST = (cmd, data) => axios.post("" + cmd, data);

const books = Vue.createApp({
  data() {
    return {
      list: [],
      editMode: false,
      authors: [],
      genres: [],
      book: undefined,
      order: { quantity: 1, succeeded: "", failed: "" },
      user: {},
      isAdmin: false,
      showCreateForm: false,
      newBook: {
        title: "",
        descr: "",
        genre: "",
        author: "",
        stock: 0,
        price: 0.0,
        currency_code: "",
      },
      updateBook: {
        idBook: "",
        title: "",
        descr: "",
        genre: "",
        author: "",
        stock: 0,
        price: 0.0,
        currency_code: "",
      },
      logined: false,
      credentials: { email: "", password: "" },
      message: { type: "", text: "" },
    };
  },

  methods: {
    // Message user interface
    showMessage(type, text) {
      this.message = { type, text };
      setTimeout(() => (this.message = { type: "", text: "" }), 2000);
    },

    // User interface methods
    search({ target: { value } }) {
      this.fetch(value && "&$search=" + value);
    },

    // Fetch books from the API
    async fetch(etc = "") {
      const { data } = await GET(
        `/browse/ListOfBooks?$expand=genre($select=name),currency($select=code,name)${etc}`
      );
      this.list = data.value;
    },

    // Inspect a book and prepare order
    async inspect(eve) {
      const book = (this.book = this.list[eve.currentTarget.rowIndex - 1]);
      const res = await GET(`/browse/Books/${book.ID}?$select=descr,stock`);
      Object.assign(book, res.data);
      this.order = { quantity: 1 };
      setTimeout(() => $("form > input").focus(), 111);
    },

    // Submit an order for a book
    async submitOrder() {
      const { book, order } = books,
        quantity = parseInt(order.quantity) || 1;
      try {
        const res = await POST(`/browse/submitOrder`, {
          quantity,
          book: book.ID,
        });
        book.stock = res.data.stock;
        books.order = {
          quantity,
          succeeded: `Successfully ordered ${quantity} item(s).`,
        };
      } catch (e) {
        this.order = {
          quantity,
          failed: e.response.data.error
            ? e.response.data.error.message
            : e.response.data,
        };
      }
    },

    // User management methods
    async login() {
      try {
        const { data } = await POST("/user/login", {
          email: this.credentials.email,
          password: this.credentials.password,
        });
        this.user = data.user;
        await this.getUserInfo();
        this.showMessage("success", "✅ Welcome " + this.user.name);
      } catch (err) {
        this.user = undefined;
        this.showMessage("error", "❌ Please log in.");
      }
    },
    async getUserInfo() {
      try {
        const { data } = await GET("/user/me");
        this.user = data.value[0] || undefined;
        this.isAdmin = this.user && this.user.role === "admin";
        this.logined = true;
      } catch (err) {
        if (err.response && err.response.status === 401) {
          console.warn("Token expired. Attempting to refresh token...");
          try {
            await this.refreshToken();
            await this.getUserInfo();
          } catch (refreshErr) {
            console.error("Failed to refresh token.", refreshErr);
            this.user = undefined;
            this.logined = false;
          }
        } else {
          console.error("Error fetching user info:", err);
          this.user = undefined;
        }
      }
    },
    async refreshToken() {
      await axios.post("/user/refreshToken", {});
      await this.getUserInfo();
    },
    async logout() {
      try {
        await axios.post("/user/logout", {});
        this.user = {}; 
        this.logined = false;
        await this.getUserInfo();
        this.showMessage("success", "✅ Logged out successfully.");
      } catch (err) {
        console.error("Error logging out:", err);
        this.user = {};
        this.showMessage("error", "❌ Error logging out.");
      }
    },

    // Book management methods

    toggleCreateForm() {
      this.showCreateForm = !this.showCreateForm;
      if (this.showCreateForm) {
        this.fetchAuthors();
        this.fetchGenres();
      }
    },

    startEdit() {
      this.editMode = true;
      this.updateBook = {
        ...this.book,
        // Asegúrate de que el género se copie como un string
        genre: this.book.genre.name,
      };
      this.fetchAuthors();
      this.fetchGenres();
    },

    cancelEdit() {
      this.editMode = false;
    },

    async createBook() {
      try {
        const payload = {
          ...this.newBook,
          author: this.newBook.author?.name || this.newBook.author,
          genre: this.newBook.genre?.name || this.newBook.genre,
        };

        const { data } = await POST("/browse/createBook", payload);

        this.list.push(data);
        this.showCreateForm = false;
        this.newBook = {
          title: "",
          descr: "",
          genre: "",
          author: "",
          stock: 0,
          price: 0.0,
          currency_code: "",
        };

        this.showMessage("success", "✅ Book created successfully.");
      } catch (err) {}
      console.error("Error creando libro:", err.response?.data || err.message);
      this.showMessage("error", "❌ The book could not be created");
    },

    async updatedBook() {
      try {
        const authorValue =
          typeof this.updateBook.author === "object"
            ? this.updateBook.author.name
            : this.updateBook.author;
        const genreValue =
          typeof this.updateBook.genre === "object"
            ? this.updateBook.genre.name
            : this.updateBook.genre;

        const payload = {
          idBook: this.updateBook.ID, // Asegúrate de que este ID se esté pasando
          title: this.updateBook.title,
          descr: this.updateBook.descr,
          author: authorValue,
          genre: genreValue,
          stock: parseInt(this.updateBook.stock), // Asegura que sea un número
          price: parseFloat(this.updateBook.price), // Asegura que sea un flotante
          currency_code: this.updateBook.currency_code,
        };

        await POST("/browse/updateBook", payload);

        this.editMode = false;
        this.showMessage("success", "✅ Book updated successfully.");
        this.fetch();
      } catch (err) {
        this.showMessage("error", "❌ The book could not be updated.");
      }
    },

    async deleteBook(id) {
      try {
        // Llama a la acción 'deleteBook' en el backend con el ID del libro
        await POST("/browse/deleteBook", {
          idBook: id,
        });

        // Oculta los detalles del libro eliminado
        this.book = undefined;

        this.fetch();
        this.showMessage("success", "✅ Book successfully deleted.");
      } catch (e) {
        console.error(
          "Error al eliminar el libro:",
          e.response?.data?.error?.message || e
        );
        this.showMessage("error", "❌ The book could not be deleted");
      }
    },

    async fetchAuthors() {
      try {
        const { data } = await GET("/browse/Authors?$select=name");
        this.authors = data.value.map((b) => ({ name: b.name }));

        this.authors = this.authors.filter(
          (a, i, arr) => arr.findIndex((x) => x.name === a.name) === i
        );
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    },

    async fetchGenres() {
      try {
        const { data } = await GET("/browse/Genres?$select=name");
        this.genres = data.value.map((b) => ({ name: b.name }));

        this.genres = this.genres.filter(
          (a, i, arr) => arr.findIndex((x) => x.name === a.name) === i
        );
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    },
  },
}).mount("#app");

books.getUserInfo();
books.fetch(); // initially fill list of books
