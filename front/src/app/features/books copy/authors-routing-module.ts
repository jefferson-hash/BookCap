import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AUTHORS_ROUTES } from './authors-module';

@NgModule({
  imports: [RouterModule.forChild(AUTHORS_ROUTES)],
})
export class AuthorsRoutingModule {}
