import { Component } from '@angular/core';
import { AuthorService } from '../../../../core/services/author.service';
import { Author } from '../../../../core/models/authors.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthorCreate } from '../author-create/author-create';

@Component({
  selector: 'app-authors-list',
  imports: [CommonModule, AuthorCreate],
  standalone: true,
  templateUrl: './authors-list.html',
  styleUrl: './authors-list.scss',
})
export class AuthorsList {
  constructor(private authorService: AuthorService, private authService: AuthService) {}

  author: Author[] = [];
  isAdmin: boolean = false;
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
      console.log("Data authors: ", this.author);
      
    });
  }

  addAuthor() {
    this.modalMode = 'create';
  }

  closeModal() {
    this.modalMode = null;
    this.ngOnInit();
  }
}
