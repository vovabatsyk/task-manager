import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {empty, Observable, throwError} from 'rxjs';
import {AuthService} from './auth.service';
import {catchError, switchMap, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WebRequestInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  // @ts-ignore
  refreshingAccessToken: boolean;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = this.addAuthHeader(request);

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.refreshingAccessToken) {
          return this.refreshAccessToken().pipe(
            switchMap(() => {
              request = this.addAuthHeader(request);
              return next.handle(request);
            }),
            catchError((err: any) => {
              throwError(err);
              this.authService.logout();
              return empty();

            }),
          );
        }
        return throwError(error);
      }),
    );
  }

  private refreshAccessToken() {
    this.refreshingAccessToken = true;
    return this.authService.getNewAccessToken().pipe(
      tap(() => {
        this.refreshingAccessToken = false;
        console.log('Access Token Refreshed');
      }),
    );
  }

  private addAuthHeader(request: HttpRequest<any>) {
    const token = this.authService.getAccessToken();
    if (token) {
      return request.clone({
        setHeaders: {
          'x-access-token': token,
        },
      });
    }
    return request;
  }
}
