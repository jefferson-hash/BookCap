import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { firstValueFrom, Observable } from 'rxjs';
import { ChatMessage } from '../models/chat.model';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;
  private API_URL = 'http://localhost:4004';
  private CAP_URL = 'http://localhost:4004';

  constructor(private http: HttpClient) {
    // Conectar socket
    this.socket = io(this.CAP_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      path: '/socket.io',
      withCredentials: true,
    });
  }
  // === OData ===
  async getChats() {
    const res = await axios.post(
      `${this.API_URL}/chat/getChatsUser`,
      {},
      { withCredentials: true }
    );
    return res.data.value;
  }

  async getAllUser() {
    const res = await axios.get(`${this.API_URL}/user/Users`, { withCredentials: true });
    return res.data.value;
  }

  async getMe(): Promise<User> {
    return firstValueFrom(
      this.http.get<{ value: User[] }>(`${this.API_URL}/user/me`, { withCredentials: true })
    ).then((res) => res.value[0]);
  }

  async createChat(user2: string) {
    const res = await axios.post(
      `${this.API_URL}/chat/createChat`,
      { user2 },
      { withCredentials: true }
    );
    return res.data;
  }

  async getMessages(chatId: string) {
    const res = await axios.get(
      `${this.API_URL}/chat/Messages?$filter=chat_ID eq '${chatId}'&$orderby=createdAt asc`
    );
    return res.data.value;
  }

  async sendMessageOData(msg: ChatMessage) {
    const res = await axios.post(`${this.API_URL}/chat/sendMessage`, {
      chatId: msg.chat_ID,
      senderId: msg.sender_ID,
      content: msg.content,
    });
    return res.data;
  }

  // === Socket ===
  joinChat(chat_ID: string) {
    this.socket.emit('joinChat', chat_ID);
  }

  sendMessageSocket(msg: ChatMessage) {
    const res = this.socket.emit('chatMessage', msg);
    return res;
  }

  onNewMessage(): Observable<ChatMessage> {
    return new Observable((subscriber) => {
      this.socket.on('chatMessage', (msg: ChatMessage) => {
        subscriber.next(msg);
      });
    });
  }
}
