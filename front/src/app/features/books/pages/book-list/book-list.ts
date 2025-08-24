import { Component } from '@angular/core';
import { BookService } from '../../../../core/services/book.service';
import { Book } from '../../../../core/models/book.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { BookDetailComponent } from '../book-detail/book-detail';
import { BookEditComponent } from '../book-edit/book-edit';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.html',
  styleUrl: './book-list.scss',
  imports: [CommonModule, BookDetailComponent, BookEditComponent],
  standalone: true,
})
export class BookListComponent {
  books: Book[] = [];
  isAdmin: boolean = false;
  selectedBook: Book | null = null;
  modalMode: 'detail' | 'edit' | null = null;

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
  onSave(book: Book) {
    console.log('Guardar libro', book);
    // aquí llamas al servicio para actualizar en backend
    this.selectedBook = null;
  }
}
