import { Injectable } from '@angular/core';
import { Book } from '../models/book.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = 'http://localhost:4004';

  constructor(private http: HttpClient) {}

  getBooks(search: string = ''): Observable<{ value: Book[] }> {
    return this.http.get<{ value: Book[] }>(
      `${this.apiUrl}/browse/ListOfBooks?$expand=genre($select=name),currency($select=code,name)${search}`
    );
  }

  getBookDetail(id: string) {
    return this.http.get<Book>(
      `${this.apiUrl}/browse/Books/${id}?$select=title,author,descr,image,price,stock&$expand=genre($select=name),currency($select=code,name)`
    );
  }

  createBook(book: Book) {
    return this.http.post<Book>(`${this.apiUrl}/browse/createBook`, book);
  }

  updateBook(book: Book) {
    return this.http.post(`${this.apiUrl}/browse/updateBook`, book);
  }

  deleteBook(idBook: string) {
    return this.http.post(`${this.apiUrl}/browse/deleteBook`, { idBook });
  }
}
