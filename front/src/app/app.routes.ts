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
      import('./features/books copy/authors-routing-module').then((m) => m.AuthorsRoutingModule),
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
