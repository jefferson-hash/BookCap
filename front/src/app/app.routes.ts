import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
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
    path: 'chat',
    loadChildren: () =>
      import('./features/chat/chat-routing-module').then((m) => m.ChatRoutingModule),
    canActivate: [AuthGuard],
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
