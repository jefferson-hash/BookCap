import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:4004';

  submitOrder(bookId: string, quantity: number) {
    return this.http.post<Order>(
      `${this.apiUrl}/browse/submitOrder`,
      { book: bookId, quantity },
      { withCredentials: true }
    );
  }
}
