import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService  {
  private userSubject = new BehaviorSubject<User | undefined>(undefined);

  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<{ user: User }>('/user/login', { email, password }).pipe(
      tap((res) => this.userSubject.next(res.user)),
      catchError((err) => {
        this.userSubject.next(undefined);
        return of(err);
      })
    );
  }

  getUserInfo() {
    return this.http.get<{ value: User[] }>('/user/me').pipe(
      tap((res) => this.userSubject.next(res.value[0])),
      catchError((err) => {
        if (err.status === 401) {
          return this.refreshToken();
        }
        return of(undefined);
      })
    );
  }

  refreshToken() {
    return this.http.post('/user/refreshToken', {}).pipe(tap(() => this.getUserInfo().subscribe()));
  }

  logout() {
    return this.http.post('/user/logout', {}).pipe(tap(() => this.userSubject.next(undefined)));
  }
}
