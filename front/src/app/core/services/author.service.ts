import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthorService {
  constructor(private http: HttpClient) {}

  getAuthors() {
    return this.http
      .get<{ value: any[] }>('/browse/Authors?$select=name')
      .pipe(map((res) => [...new Set(res.value.map((b) => b.name))]));
  }
}
