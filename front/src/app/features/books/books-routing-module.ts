import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BOOKS_ROUTES } from './books-module';

@NgModule({
  imports: [RouterModule.forChild(BOOKS_ROUTES)],
})
export class BooksRoutingModule {}
