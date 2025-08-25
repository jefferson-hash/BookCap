import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth-routing-module').then((m) => m.AuthRoutingModule),
  },
  {
    path: 'books',
    loadChildren: () =>
      import('./features/books/books-routing-module').then((m) => m.BooksRoutingModule),
  },
  {
    path: 'authors',
    loadChildren: () =>
      import('./features/authors/authors-routing-module').then((m) => m.AuthorsRoutingModule),
  },
  {
    path: '',
    redirectTo: 'books',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'books',
  },
];
