import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Author } from '../models/authors.model';

@Injectable({ providedIn: 'root' })
export class AuthorService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:4004';

  getAuthors(search: string = ''): Observable<{ value: Author[] }> {
    return this.http.get<{ value: Author[] }>(`${this.apiUrl}/browse/Authors${search}`, {
      withCredentials: true,
    });
  }
}
