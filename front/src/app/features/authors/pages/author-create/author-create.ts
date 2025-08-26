import { Component, EventEmitter, Output } from '@angular/core';
import { AuthorService } from '../../../../core/services/author.service';
import { Author } from '../../../../core/models/authors.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-author-create',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './author-create.html',
  styleUrl: './author-create.scss',
})
export class AuthorCreate {
  newAuthor: Partial<Author> = {};
  @Output() close = new EventEmitter<void>();

  constructor(private authorService: AuthorService) {}

  ngOnInit() {}

  createAuthors(author: Partial<Author>) {
    const payload = {
      nameAuthor: author.name,
      dateOfBirth: author.dateOfBirth,
      dateOfDeath: author.dateOfDeath,
      placeOfBirth: author.placeOfBirth,
      placeOfDeath: author.placeOfDeath,
      imageUrl: author.imageUrl,
      biography: author.biography,
    };
    console.log('data create author: ', payload);

    this.authorService.createAuthor(payload).subscribe({
      next: (author) => {
        console.log('Author created:', author);
        this.newAuthor = {}; // limpiar formulario
        this.closeModal()
      },
      error: (err) => {
        console.error('Error creando autor:', err);
      },
    });
  }

  closeModal() {
    this.close.emit();
  }
}
