import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CHAT_ROUTES } from './chat-module';

@NgModule({
  imports: [RouterModule.forChild(CHAT_ROUTES)],
})
export class ChatRoutingModule {}
