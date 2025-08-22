import { Component } from '@angular/core';
import { BookService } from '../../../../core/services/book.service';
import { Book } from '../../../../core/models/book.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.html',
  styleUrl: './book-list.scss',
  imports: [CommonModule],
  standalone: true,
})
export class BookListComponent {
  books: Book[] = [];
  isAdmin: boolean = false;

  constructor(private bookService: BookService, private authService: AuthService) {}

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
          console.log('Libro eliminado con éxito.');
          this.loadBooks(); // Recarga la lista de libros
        },
        error: (err) => console.error('Error al eliminar el libro', err),
      });
    }
  }

  editBook(book: Book) {
    console.log('Editar libro:', book);
    // Aquí puedes implementar la navegación a un formulario de edición
  }
}
