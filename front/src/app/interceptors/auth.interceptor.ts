import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { AuthService } from "../core/services/auth.service";
import { catchError, Observable, switchMap, throwError } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const cloned = req.clone({ withCredentials: true }); // siempre manda cookies

    return next.handle(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.auth.refreshToken().pipe(
            switchMap(() => {
              const retry = req.clone({ withCredentials: true });
              return next.handle(retry);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
