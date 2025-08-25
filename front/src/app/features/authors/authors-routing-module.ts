import { RouterModule } from "@angular/router";
import { AUTHORS_ROUTES } from "./authors-module";
import { NgModule } from "@angular/core";

@NgModule({
  imports: [RouterModule.forChild(AUTHORS_ROUTES)],
})
export class AuthorsRoutingModule {}
