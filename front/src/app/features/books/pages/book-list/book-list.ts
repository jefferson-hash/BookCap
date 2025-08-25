import { Component } from '@angular/core';
import { BookService } from '../../../../core/services/book.service';
import { Book } from '../../../../core/models/book.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { BookDetailComponent } from '../book-detail/book-detail';
import { BookEditComponent } from '../book-edit/book-edit';
import { OrderService } from '../../../../core/services/order.service';
import { BookCreate } from '../book-create/book-create';

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
  selectedBook: Book | null = null;
  modalMode: 'detail' | 'edit' | 'create' | null = null;

  constructor(
    private bookService: BookService,
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.isAdmin = user?.role === 'admin';
    });
    this.loadBooks();
  }

  loadBooks(search: string = '') {
    this.bookService.getBooks('&$search=' + search).subscribe((res) => {
      this.books = res.value;
      
    });
  }

  deleteBook(bookId: string) {
    if (confirm('¿Estás seguro de que quieres eliminar este libro?')) {
      this.bookService.deleteBook(bookId).subscribe({
        next: () => {
          this.loadBooks(); // Recarga la lista de libros
        },
        error: (err) => console.error('Error al eliminar el libro', err),
      });
    }
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
    console.log('Payload to update:', payload);

    this.bookService.updateBook(payload).subscribe({
      next: () => {
        this.loadBooks(); // Recarga la lista de libros
        this.closeModal();
      },
      error: (err) => console.error('Error al actualizar el libro', err),
    });
    this.selectedBook = null;
  }

  orderBook(bookI: string, quantity: number = 1) {
    this.orderService.submitOrder(bookI, quantity).subscribe({
      next: () => {
        alert('Order placed successfully!');
      },
      error: (err) => {
        console.error('Error placing order', err);
        alert('Failed to place order. Please try again.');
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
      },
      error: (err) => console.error('Error al crear el libro', err),
    });
  }
}
