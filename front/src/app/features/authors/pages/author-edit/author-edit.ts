import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthorService } from '../../../../core/services/author.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthorUpdate } from '../../../../core/models/authors.model';

@Component({
  selector: 'app-author-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './author-edit.html',
  styleUrl: './author-edit.scss',
})
export class AuthorEdit implements OnInit {
  @Input() authorId: string | null = null;
  @Output() close = new EventEmitter<void>();

  author: AuthorUpdate | null = null;

  constructor(private authorService: AuthorService) {}

  ngOnInit() {
    if (this.authorId) {
      this.authorService.getDetailsAuthor(this.authorId).subscribe((res) => {
        this.author = {
          idAuthor: res.ID,
          nameAuthor: res.name,
          imageUrl: res.imageUrl || '',
          dateOfBirth: res.dateOfBirth || '',
          dateOfDeath: res.dateOfDeath || '',
          placeOfBirth: res.placeOfBirth || '',
          placeOfDeath: res.placeOfDeath || '',
          biography: res.biography || '',
        };
      });
    }
  }

  updateAuthor() {
    if (!this.author) return;

    const payload: AuthorUpdate = {
      idAuthor: this.author.idAuthor,
      nameAuthor: this.author.nameAuthor,
      imageUrl: this.author.imageUrl || '', // <- valor por defecto
      dateOfBirth: this.author.dateOfBirth || '', // <- valor por defecto
      dateOfDeath: this.author.dateOfDeath || '', // <- valor por defecto
      placeOfBirth: this.author.placeOfBirth || '', // <- valor por defecto
      placeOfDeath: this.author.placeOfDeath || '', // <- valor por defecto
      biography: this.author.biography || '', // <- valor por defecto
    };

    this.authorService.updateAuthor(payload).subscribe({
      next: () => {
        this.onClose();
      },
      error: (err) => {
        console.error('Error actualizando autor:', err);
      },
    });
  }

  onClose() {
    this.close.emit();
  }
}
