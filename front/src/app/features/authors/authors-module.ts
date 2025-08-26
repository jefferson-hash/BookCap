import { Routes } from "@angular/router";
import { AuthorsList } from "./pages/authors-list/authors-list";

export const AUTHORS_ROUTES: Routes = [
  { path: '', component: AuthorsList },
  // { path: ':id', component: BookDetailComponent, canActivate: [AuthGuard] },
  // { path: 'create', component: BookCreateComponent },
  // { path: ':id/edit', component: BookFromComponent }
];