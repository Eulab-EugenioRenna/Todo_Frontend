import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../environments/environment';
import { AuthDto } from './model/AuthDto';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { UserDto } from './model/UserDto';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private JWT_TOKEN = 'JWT_TOKEN';
  private loggedUser!: string;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private http = inject(HttpClient);
  private router = inject(Router);

  login$(dto: AuthDto) {
    return this.http
      .post(`${environment.BASE_URL}/auth/login`, dto)
      .pipe(tap((tokens) => this.doLoginUser(dto.email, tokens)));
  }

  doLoginUser(email: any, tokens: any) {
    this.loggedUser = email;
    this.storeJwtToken(tokens.access_token);
    this.isAuthenticatedSubject.next(true);
  }

  storeJwtToken(access_token: any) {
    localStorage.setItem(this.JWT_TOKEN, access_token);
  }

  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/welcome']);
  }
  getSignedUser$(): Observable<UserDto> {
    return this.http.get<UserDto>(`${environment.BASE_URL}/user/me`);
  }
  isLoggedIn() {
    return this.isAuthenticatedSubject.value;
  }
  signup$(dto: AuthDto) {
    return this.http.post(`${environment.BASE_URL}/auth/signup`, dto);
  }
  isTokenExpired() {
    const token = localStorage.getItem(this.JWT_TOKEN);
    if (!token) return true;
    const decoded = jwtDecode(token);
    const expirationDate = decoded.exp * 1000;
    const now = new Date().getTime();
    return expirationDate < now
  }
}
