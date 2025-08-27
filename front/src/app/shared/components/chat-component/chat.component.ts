import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../core/services/chat.service';
import { ChatMessage } from '../../../core/models/chat.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  chats: any[] = [];
  messages: ChatMessage[] = [];
  selectedChatId: string | null = null;
  userId = 'd460ccd8-09d8-4a7c-8e7c-f45d813d1378'; // tu userId real
  newMessage = '';

  constructor(private chatService: ChatService) {}

  async ngOnInit() {
    // cargar chats del usuario
    this.chats = await this.chatService.getChats(this.userId);

    // escuchar nuevos mensajes vía socket
    this.chatService.onNewMessage().subscribe((msg) => {
      if (msg.chat_ID === this.selectedChatId) {
        this.messages.push(msg);
      }
    });
  }

  async openChat(chatId: string) {
    this.selectedChatId = chatId;
    this.chatService.joinChat(chatId);

    // cargar historial del chat
    this.messages = await this.chatService.getMessages(chatId);
  }

  async sendMessage() {
    if (!this.newMessage.trim() || !this.selectedChatId) return;

    const msg: ChatMessage = {
      chat_ID: this.selectedChatId,
      sender_ID: this.userId,
      content: this.newMessage,
    };

    // persistencia vía OData
    await this.chatService.sendMessageOData(msg);

    this.chatService.joinChat(this.selectedChatId);

    // realtime vía socket
    this.chatService.sendMessageSocket(msg);

    this.newMessage = '';
  }
}
