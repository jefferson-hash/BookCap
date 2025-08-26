import { Component } from '@angular/core';
import { AuthorService } from '../../../../core/services/author.service';
import { Author } from '../../../../core/models/authors.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthorCreate } from '../author-create/author-create';
import { AlertService } from '../../../../core/services/alert.service';
import { TruncatePipe } from '../../../../pipes/truncate-pipe';
import { AuthorEdit } from '../author-edit/author-edit';

@Component({
  selector: 'app-authors-list',
  imports: [CommonModule, AuthorCreate, AuthorEdit, TruncatePipe],
  standalone: true,
  templateUrl: './authors-list.html',
  styleUrl: './authors-list.scss',
})
export class AuthorsList {
  constructor(
    private authorService: AuthorService,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  author: Author[] = [];
  isAdmin: boolean = false;
  selectedAuthorId: string | null = null;
  modalMode: 'detail' | 'edit' | 'create' | null = null;

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.isAdmin = user?.role === 'admin';
    });
    this.loadAuthors();
  }

  loadAuthors(search: string = '') {
    this.authorService.getAuthors('?$search=' + search).subscribe((res) => {
      this.author = res.value;
    });
  }

  addAuthor() {
    this.modalMode = 'create';
  }

  deleteAuthor(idAuthor: string, nameAuthor: string) {
    this.alertService
      .showConfirmation('', `¿Deseas eliminar al author ${nameAuthor}?`)
      .then((confirmed) => {
        if (confirmed) {
          console.log('id author delete:'), idAuthor;
          this.authorService.deleteAuthor(idAuthor).subscribe({
            next: () => {
              this.alertService.showSuccess('Se elimino el libro con exito');
              this.loadAuthors();
            },
            error: (err) => console.error('Error al eliminar el libro', err),
          });
        } else {
          this.alertService.showInfo('Eliminación cancelada');
        }
      });
  }

  closeModal() {
    this.modalMode = null;
    this.ngOnInit();
  }

  editAuthor(author: Author) {
    this.selectedAuthorId = author.ID;
    this.modalMode = 'edit';
  }
}
