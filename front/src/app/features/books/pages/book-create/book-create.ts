import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book, Genre } from '../../../../core/models/book.model';
import { Author } from '../../../../core/models/authors.model';
import { GenreService } from '../../../../core/services/genre.service';
import { AuthorService } from '../../../../core/services/author.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-create',
  imports: [CommonModule, FormsModule],
  templateUrl: './book-create.html',
  styleUrl: './book-create.scss',
})
export class BookCreate {
  @Output() save = new EventEmitter<Book>();
  @Output() close = new EventEmitter<void>();
  createBook: Partial<Book> = {};
  genres: Genre[] = [];
  authors: Author[] = [];

  constructor(private genreService: GenreService, private authorService: AuthorService) {}

  ngOnInit() {
    this.genreService.getGenres().subscribe((data) => {
      this.genres = data.value;
    });

    this.authorService.getAuthors().subscribe((data) => {
      this.authors = data.value;
    });
  }

  create() {
    this.save.emit(this.createBook as Book);
  }

  onClose() {
    this.close.emit();
  }
}
