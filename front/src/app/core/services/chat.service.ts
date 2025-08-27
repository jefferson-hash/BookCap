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
  private API_URL = 'http://localhost:4004/chat'; // CAP OData

  constructor() {
    // Conectar socket
    this.socket = io('/socket.io', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      path: '/socket.io', 
      withCredentials: true, 
    });
  }

  // === OData ===
  async getChats(userId: string) {
    const res = await axios.get(
      `${this.API_URL}/Chats?$filter=(user1_ID eq '${userId}' or user2_ID eq '${userId}')`
    );
    return res.data.value;
  }

  async getMessages(chatId: string) {
    const res = await axios.get(
      `${this.API_URL}/Messages?$filter=chat_ID eq '${chatId}'&$orderby=createdAt asc`
    );
    return res.data.value;
  }

  async sendMessageOData(msg: ChatMessage) {
    const res = await axios.post(`${this.API_URL}/sendMessage`, {
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
