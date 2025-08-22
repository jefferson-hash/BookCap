import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AUTH_ROUTES } from './auth-module';

@NgModule({
  imports: [RouterModule.forChild(AUTH_ROUTES)],
})
export class AuthRoutingModule {}
