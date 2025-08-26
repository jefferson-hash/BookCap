import { Component, EventEmitter, Output } from '@angular/core';
import { AuthorService } from '../../../../core/services/author.service';
import { Author } from '../../../../core/models/authors.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../../core/services/alert.service';

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

  constructor(private authorService: AuthorService, private alertService: AlertService) {}

  ngOnInit() {}

  createAuthors(author: Partial<Author>) {
    // Validar si ya existe un autor con ese nombre
    this.authorService.getAuthors('?$search=' + author.name?.toString()).subscribe({
      next: (authors) => {
        if (author && authors.value.length > 0) {
          this.alertService.showError(`${author.name}, ya se encunatra en nuestros autores`);
          return;
        }

        // Si no existe, proceder a crear
        const payload = {
          nameAuthor: author.name,
          dateOfBirth: author.dateOfBirth,
          dateOfDeath: author.dateOfDeath,
          placeOfBirth: author.placeOfBirth,
          placeOfDeath: author.placeOfDeath,
          imageUrl: author.imageUrl,
          biography: author.biography,
        };

        this.authorService.createAuthor(payload).subscribe({
          next: () => {
            this.alertService.showSuccess('Autor creado con éxito');
            this.newAuthor = {}; // limpiar formulario
            this.closeModal();
          },
          error: (err) => {
            console.error('Error creando autor:', err);
            this.alertService.showError('Ocurrió un error al crear el autor');
          },
        });
      },
      error: (err) => {
        console.error('Error validando autor existente:', err);
        this.alertService.showError('No se pudo validar si el autor existe');
      },
    });
  }

  closeModal() {
    this.close.emit();
  }
}
