import { Routes } from '@angular/router';
import { BookListComponent } from './pages/book-list/book-list';


export const BOOKS_ROUTES: Routes = [
  { path: '', component: BookListComponent },
  // { path: ':id', component: BookDetailComponent, canActivate: [AuthGuard] },
  // { path: 'create', component: BookCreateComponent },
  // { path: ':id/edit', component: BookFromComponent }
];
