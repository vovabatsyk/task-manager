import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {WebRequestService} from './web-request.service';
import {Router} from '@angular/router';
import {shareReplay, tap} from 'rxjs/operators';
import {resolveFileWithPostfixes} from '@angular/compiler-cli/ngcc/src/utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private webService: WebRequestService,
              private router: Router) {
  }

  login(email: string, password: string) {
    return this.webService.login(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        // @ts-ignore
        this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
      }),
    );
  }

  logout() {
    this.removeSession();
  }

  getAccessToken() {
    return localStorage.getItem('x-access-token')
  }

  getRefreshToken() {
    return localStorage.getItem('x-refresh-token')
  }

  setAccessToken(accessToken: string) {
    return localStorage.setItem('x-access-token', accessToken)
  }

  private setSession(userId: string, accessToken: string, refreshToken: string) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('access-token', accessToken);
    localStorage.setItem('refresh-token', refreshToken);
  }

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
  }

}