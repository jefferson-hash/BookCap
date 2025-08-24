import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Genre } from '../models/book.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GenreService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:4004';

  getGenres(): Observable<{ value: Genre[] }> {
    return this.http.get<{value: Genre[]}>(`${this.apiUrl}/browse/Genres?$select=name`);
  }
}
