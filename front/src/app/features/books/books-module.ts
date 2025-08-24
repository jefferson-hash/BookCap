import { Routes } from '@angular/router';
import { BookListComponent } from './pages/book-list/book-list';
import { AuthGuard } from '../../core/guards/auth.guard';


export const BOOKS_ROUTES: Routes = [
  { path: '', component: BookListComponent, canActivate: [AuthGuard] },
  // { path: ':id', component: BookDetailComponent, canActivate: [AuthGuard] },
  // { path: 'create', component: BookCreateComponent },
  // { path: ':id/edit', component: BookFromComponent }
];
