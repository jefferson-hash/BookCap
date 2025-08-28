import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { Observable } from 'rxjs';
import { ChatMessage } from '../models/chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;
  private API_URL = 'http://localhost:4004';
  private CAP_URL = 'http://localhost:4004';

  constructor() {
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

  async createChat(user2: string) {
    const res = await axios.post(`${this.API_URL}/chat/createChat`, {user2}, { withCredentials: true });
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
    this.socket.emit('chatMessage', msg);
  }

  onNewMessage(): Observable<ChatMessage> {
    return new Observable((subscriber) => {
      this.socket.on('chatMessage', (msg: ChatMessage) => {
        subscriber.next(msg);
      });
    });
  }
}
