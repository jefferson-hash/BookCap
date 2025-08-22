import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  submitOrder(bookId: number, quantity: number) {
    return this.http.post<Order>('/browse/submitOrder', { book: bookId, quantity });
  }
}
