import { Routes } from '@angular/router';
import { BookListComponent } from './pages/book-list/book-list';

export const BOOKS_ROUTES: Routes = [
  { path: '', component: BookListComponent },
  // { path: 'create', component: BookCreateComponent },
  // { path: ':id', component: BookDetailComponent },
  // { path: ':id/edit', component: BookFromComponent }
];
