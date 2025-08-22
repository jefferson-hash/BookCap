import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GenreService {
  constructor(private http: HttpClient) {}

  getGenres() {
    return this.http
      .get<{ value: any[] }>('/browse/Genres?$select=name')
      .pipe(map((res) => [...new Set(res.value.map((b) => b.name))]));
  }
}
