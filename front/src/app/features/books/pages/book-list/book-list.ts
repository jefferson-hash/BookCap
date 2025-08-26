import { Component } from '@angular/core';
import { BookService } from '../../../../core/services/book.service';
import { Book } from '../../../../core/models/book.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { BookDetailComponent } from '../book-detail/book-detail';
import { BookEditComponent } from '../book-edit/book-edit';
import { OrderService } from '../../../../core/services/order.service';
import { BookCreate } from '../book-create/book-create';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.html',
  styleUrl: './book-list.scss',
  imports: [CommonModule, BookDetailComponent, BookEditComponent, BookCreate],
  standalone: true,
})
export class BookListComponent {
  books: Book[] = [];
  isAdmin: boolean = false;
  isLoged: boolean = false;
  selectedBook: Book | null = null;
  modalMode: 'detail' | 'edit' | 'create' | null = null;

  constructor(
    private bookService: BookService,
    private authService: AuthService,
    private orderService: OrderService,
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.isLoged = !!user; 
      this.isAdmin = user?.role === 'admin';
    });

    this.loadBooks();
  }

  loadBooks(search: string = '') {
    this.bookService.getBooks('&$search=' + search).subscribe((res) => {
      this.books = res.value;
    });
  }

  deleteBook(bookId: string, titleBook: string) {
    this.alertService
      .showConfirmation('', `¿Deseas eliminar el libro ${titleBook}?`)
      .then((confirmed) => {
        if (confirmed) {
          this.bookService.deleteBook(bookId).subscribe({
            next: () => {
              this.alertService.showSuccess('Se elimino el libro con exito');
              this.loadBooks();
            },
            error: (err) => console.error('Error al eliminar el libro', err),
          });
        } else {
          this.alertService.showInfo('Eliminación cancelada');
        }
      });
  }

  selectBook(book: Book) {
    this.selectedBook = book;
    this.modalMode = 'detail';
  }

  editBook(book: Book) {
    this.selectedBook = { ...book };
    this.modalMode = 'edit';
  }

  closeModal() {
    this.selectedBook = null;
    this.modalMode = null;
  }
  onSaveBook(book: Book) {
    const payload = {
      idBook: book.ID,
      title: book.title,
      descr: book.descr,
      genre: book.genre?.name ?? '',
      author: book.author,
      stock: book.stock,
      price: book.price,
      imageUrl: book.imageUrl,
      currency_code: book.currency_code,
    };

    this.bookService.updateBook(payload).subscribe({
      next: () => {
        this.loadBooks();
        this.closeModal();
        this.alertService.showSuccess('Actualización exitosa');
      },
      error: (err) => console.error('Error al actualizar el libro', err),
    });
    this.selectedBook = null;
  }

  orderBook(bookI: string, quantity: number = 1) {
    this.bookService.getBookDetail(bookI).subscribe({
      next: (bookStock) => {
        if (quantity > bookStock.stock) {
          this.alertService.showError('La orden supera el stock en bodega. Valida tu orden');
        } else {
          this.orderService.submitOrder(bookI, quantity).subscribe({
            next: () => {
              this.alertService.showSuccess('Orden realizada con éxito');
            },
            error: (err) => {
              console.error('Error placing order', err);
              this.alertService.showError('Hubo un error al realizar la orden');
            },
          });
        }
      },
      error: (err) => {
        console.error('Error fetching book details', err);
        this.alertService.showError('No se pudo obtener la información del libro');
      },
    });
  }

  addBook() {
    this.modalMode = 'create';
  }

  onCreate(book: Book) {
    const payload = {
      idBook: book.ID,
      title: book.title,
      descr: book.descr,
      genre: book.genre?.name ?? '',
      author: book.author?.name ?? '',
      stock: book.stock,
      price: book.price,
      imageUrl: book.imageUrl,
      currency_code: book.currency_code,
    };

    this.bookService.createBook(payload).subscribe({
      next: () => {
        this.loadBooks(); // Recarga la lista de libros
        this.closeModal();
        this.alertService.showSuccess('Libro cerado con exito');
      },
      error: (err) => console.error('Error al crear el libro', err),
    });
  }
}
