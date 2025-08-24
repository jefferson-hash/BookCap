import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AuthorListComponent } from './pages/authors-list/book-list';


export const AUTHORS_ROUTES: Routes = [
  { path: '', component: AuthorListComponent, canActivate: [AuthGuard] },
  // { path: ':id', component: BookDetailComponent, canActivate: [AuthGuard] },
  // { path: 'create', component: BookCreateComponent },
  // { path: ':id/edit', component: BookFromComponent }
];
