using {sap.capire.bookshop as my} from '../../../db/schema';

service AdminService @(path: '/browse') {
    @readonly
    entity Books       as
        projection on my.Books {
            *,
            author.name as author
        }
        excluding {
            createdBy,
            modifiedBy
        };

    @readonly
    entity Authors     as
        projection on my.Authors {
            *,
            books : redirected to Books
                        on books.author = $self.ID
        }
        excluding {
            createdBy,
            modifiedBy
        };

    @readonly
    entity ListOfBooks as
        projection on Books
        excluding {
            descr
        };

    action createBook(title: String,
                      author: String,
                      descr: String,
                      genre: String,
                      stock: Integer,
                      price: Decimal,
                      imageUrl: String,
                      currency_code: String)              returns String;

    action updateBook(idBook: String,
                      title: String,
                      author: String,
                      descr: String,
                      genre: String,
                      stock: Integer,
                      price: Decimal,
                      imageUrl: String,
                      currency_code: String)              returns String;

    action deleteBook(idBook: String)                     returns String;

    action submitOrder(book: Books:ID, quantity: Integer) returns {
        stock : Integer
    };

    event OrderedBook : {
        book     : Books:ID;
        quantity : Integer;
        buyer    : String
    };


    action createAuthor(nameAuthor: String,
                        imageUrl: String,
                        biography: String,
                        dateOfBirth: Date,
                        dateOfDeath: Date,
                        placeOfBirth: String,
                        placeOfDeath: String)             returns String;

    action deleteAuthor(idAuthor: String)                 returns String;

    action updateAuthor(idAuthor: String,
                        nameAuthor: String,
                        imageUrl: String,
                        biography: String,
                        dateOfBirth: Date,
                        dateOfDeath: Date,
                        placeOfBirth: String,
                        placeOfDeath: String)             returns String;

}
