import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:4004';

  private userSubject = new BehaviorSubject<User | undefined>(undefined);

  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}
  login(email: string, password: string) {
    return this.http
      .post<{ user: User }>(
        `${this.apiUrl}/user/login`,
        { email, password },
        { withCredentials: true } 
      )
      .pipe(
        tap((res) => this.userSubject.next(res.user)),
        catchError((err) => {
          this.userSubject.next(undefined);
          return of(err);
        })
      );
  }

  getUserInfo() {
    return this.http
      .get<{ value: User[] }>(
        `${this.apiUrl}/user/me`,
        { withCredentials: true } 
      )
      .pipe(
        tap((res) => this.userSubject.next(res.value[0])),
        catchError((err) => {
          if (err.status === 401) {
            return this.refreshToken().pipe(
              tap(() => {
                // después de refrescar, vuelvo a pedir el usuario
                this.getUserInfo().subscribe();
              })
            );
          }
          return of(undefined);
        })
      );
  }

  refreshToken() {
    return this.http.post(
      `${this.apiUrl}/user/refreshToken`,
      {},
      { withCredentials: true } 
    );
  }

  logout() {
    return this.http
      .post(
        `${this.apiUrl}/user/logout`,
        {},
        { withCredentials: true }
      )
      .pipe(tap(() => this.userSubject.next(undefined)));
  }
}
