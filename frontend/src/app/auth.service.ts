import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';
import { config } from '../config';

export interface User {
  _id?: string;
  username: string;
  password?: string;
  name: string;
  isAdmin?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = config.apiUrl;
  
  currentUser: User | null = null;
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  constructor() {
    this.loadUser();
  }

  private loadUser() {
    const userJson = localStorage.getItem(this.userKey);
    if (userJson) {
      this.currentUser = JSON.parse(userJson);
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { username, password }).pipe(
      tap(response => {
        if (response.success) {
          this.currentUser = response.user;
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.userKey, JSON.stringify(response.user));
        }
      })
    );
  }

  register(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, user);
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }
  
  getUser(): User | null {
    return this.currentUser;
  }
  
  isAdmin(): boolean {
    return this.currentUser?.isAdmin || false;
  }
}
