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
  users: any[] = [];
  messages: ChatMessage[] = [];
  selectedUserId: string | null = null;
  selectedChatId: string | null = null;
  userId = 'faa43834-8de1-4c61-9934-ccc007ed85a6'; // tu userId real
  newMessage = '';

  constructor(private chatService: ChatService) {}

  async ngOnInit() {
    // cargar chats del usuario
    this.chats = await this.chatService.getChats();

    this.users = await this.chatService.getAllUser();

    // escuchar nuevos mensajes vía socket
    this.chatService.onNewMessage().subscribe((msg) => {
      if (msg.chat_ID === this.selectedChatId) {
        this.messages.push(msg);
      }
    });
  }

  async createChat(user2: string) {
    const result = await this.chatService.createChat(user2);  
    this.selectedUserId = user2;
    this.openChat(result.chatId);
  }

  async openChat(chatId: string) {
    this.selectedChatId = chatId;
    this.chatService.joinChat(chatId);

    this.messages = await this.chatService.getMessages(chatId);
  }

  async sendMessage() {
    if (!this.newMessage.trim() || !this.selectedChatId) return;

    const msg: ChatMessage = {
      chat_ID: this.selectedChatId,
      sender_ID: this.userId,
      content: this.newMessage,
    };

    this.chatService.joinChat(this.selectedChatId);

    // realtime vía socket
    this.chatService.sendMessageSocket(msg);

    this.newMessage = '';
  }
}
