import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Book, Genre } from '../../../../core/models/book.model';
import { BookService } from '../../../../core/services/book.service';
import { GenreService } from '../../../../core/services/genre.service';
import { AuthorService } from '../../../../core/services/author.service';
import { Author } from '../../../../core/models/authors.model';

@Component({
  selector: 'app-book-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-edit.html',
  styleUrl: './book-edit.scss',
})
export class BookEditComponent {
  @Input() book!: Book; // 👈 recibe el libro
  @Output() save = new EventEmitter<Book>();
  @Output() close = new EventEmitter<void>();
  editableBook!: Book;
  genres: Genre[] = [];
  authors: Author[] = [];

  constructor(
    private bookService: BookService,
    private genreService: GenreService,
    private authorService: AuthorService
  ) {}

  ngOnInit() {
    const id = this.book?.ID;
    if (id) {
      this.bookService.getBookDetail(id.toString()).subscribe((res) => {
        this.editableBook = res;
      });
    }

    this.genreService.getGenres().subscribe((data) => {
      this.genres = data.value;
    });

    this.authorService.getAuthors().subscribe((data) => {
      this.authors = data.value;
    });
  }

  onSave() {
    this.save.emit(this.editableBook);
  }

  onClose() {
    this.close.emit();
  }
}
