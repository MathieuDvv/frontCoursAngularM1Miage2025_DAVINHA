import { AuthService } from './auth.service';
import { Component, OnInit, signal, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { HttpClient } from '@angular/common/http';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { Assignment } from './assignments/assignment.model';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { config } from '../config';

@Component({
  selector: 'app-root',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    RouterOutlet,
    RouterModule,
    MatSlideToggleModule,
    CommonModule,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})

/**
 * @title Basic toolbar
 */
export class App implements OnInit {
  protected readonly title = signal('assignment-app');
  dbStatus = 'unknown';
  private router = inject(Router);

  constructor(public authService: AuthService, private http: HttpClient) {}

  ngOnInit() {
    this.checkDbStatus();
    setInterval(() => this.checkDbStatus(), 10000);
  }

  checkDbStatus() {
    this.http.get<any>(config.apiUrl + '/status').subscribe(
      (res) => {
        this.dbStatus = res.dbConnected ? 'online' : 'offline';
      },
      (err) => {
        this.dbStatus = 'offline';
      }
    );
  }

  toggleLogin() {
    if (this.authService.isAuthenticated()) {
      this.authService.logout();
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  initDB() {
    this.http.post(config.apiUrl + '/db/init', {}).subscribe(() => {
      console.log('Database initialized');
    });
  }
}
