import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Author, AuthorUpdate } from '../models/authors.model';

@Injectable({ providedIn: 'root' })
export class AuthorService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:4004';

  getAuthors(search: string = ''): Observable<{ value: Author[] }> {
    return this.http.get<{ value: Author[] }>(`${this.apiUrl}/browse/Authors${search}`, {
      withCredentials: true,
    });
  }

  getDetailsAuthor(idAuthor: string): Observable<Author> {
    return this.http.get<Author>(`${this.apiUrl}/browse/Authors/${idAuthor}`);
  }

  createAuthor(author: Partial<Author>): Observable<Author> {
    return this.http.post<Author>(`${this.apiUrl}/browse/createAuthor`, author, {
      withCredentials: true,
    });
  }
  updateAuthor(author: AuthorUpdate) {
    return this.http.post(`${this.apiUrl}/browse/updateAuthor`, author, { withCredentials: true });
  }

  deleteAuthor(idAuthor: string) {
    return this.http.post(
      `${this.apiUrl}/browse/deleteAuthor`,
      { idAuthor },
      { withCredentials: true }
    );
  }
}
