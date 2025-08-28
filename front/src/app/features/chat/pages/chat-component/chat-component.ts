import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '../../../../core/models/chat.model';
import { ChatService } from '../../../../core/services/chat.service';

@Component({
  selector: 'app-chat-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-component.html',
  styleUrl: './chat-component.scss',
})
export class ChatComponent implements OnInit, AfterViewChecked {
  chats: any[] = [];
  users: any[] = [];
  messages: ChatMessage[] = [];
  selectedUserId: string | null = null;
  selectedChatId: string | null = null;
  userId: string | undefined;
  nameUser: string | undefined;
  newMessage = '';

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  constructor(private chatService: ChatService) {}

  async ngOnInit() {
    this.chats = await this.chatService.getChats();

    const me = await this.chatService.getMe();
    this.userId = me.ID;
    this.nameUser = me.name;

    this.users = await this.chatService.getAllUser();

    // escuchar mensajes en tiempo real
    this.chatService.onNewMessage().subscribe((msg) => {
      if (msg.chat_ID === this.selectedChatId) {
        this.messages.push(msg);
        this.scrollToBottom();
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
    this.scrollToBottom();
  }

  async sendMessage() {
    if (!this.newMessage.trim() || !this.selectedChatId) return;

    this.chatService.joinChat(this.selectedChatId);

    const msg: ChatMessage = {
      chat_ID: this.selectedChatId,
      content: this.newMessage,
      sender_ID: this.userId!,
    };

    this.chatService.sendMessageSocket(msg);
    this.newMessage = '';
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
