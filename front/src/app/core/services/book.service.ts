import { Injectable } from '@angular/core';
import { Book, BookUpdate } from '../models/book.model';
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
      `${this.apiUrl}/browse/ListOfBooks?$expand=genre($select=name),currency($select=code,name)${search}`,
      { withCredentials: true }
    );
  }

  getBookDetail(id: string) {
    return this.http.get<Book>(
      `${this.apiUrl}/browse/Books/${id}?$select=title,author,descr,imageUrl,price,stock,currency_code&$expand=genre($select=name)`,
      { withCredentials: true }
    );
  }

  createBook(book: BookUpdate) {
    return this.http.post<BookUpdate>(`${this.apiUrl}/browse/createBook`, book, {
      withCredentials: true,
    });
  }

  updateBook(book: BookUpdate) {
    return this.http.post(`${this.apiUrl}/browse/updateBook`, book, { withCredentials: true });
  }

  deleteBook(idBook: string) {
    return this.http.post(
      `${this.apiUrl}/browse/deleteBook`,
      { idBook },
      { withCredentials: true }
    );
  }
}
