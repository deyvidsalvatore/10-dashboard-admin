import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../types/User';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <div class="header">
        <h2 data-test-id="welcome-msg">Admin Secure Dashboard</h2>
        <button class="logout-btn" (click)="logout()">Logout</button>
      </div>

      <div class="content" *ngIf="user">
        <div class="card">
          <h3>Connection Secured</h3>
          <p>
            Welcome back, <strong>{{ user?.username }}</strong
            >!
          </p>
          <p class="role-badge" data-test-id="user-role-display">
            Role: {{ user?.role }}
          </p>
          <br />
          <p class="secret-data">
            Top Secret Admin Data: <i>Revenue is up 250%</i> 🚀
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        max-width: 800px;
        margin: 40px auto;
        font-family: 'Inter', sans-serif;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #1f2937;
        color: white;
        padding: 16px 24px;
        border-radius: 8px 8px 0 0;
      }
      h2 {
        margin: 0;
        font-size: 20px;
      }
      .logout-btn {
        background: #ef4444;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
      }
      .logout-btn:hover {
        background: #dc2626;
      }
      .content {
        background: #ffffff;
        padding: 24px;
        border: 1px solid #e5e7eb;
        border-radius: 0 0 8px 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      }
      .card {
        background: #f3f4f6;
        padding: 20px;
        border-radius: 8px;
        border-left: 4px solid #3b82f6;
      }
      h3 {
        margin-top: 0;
        color: #111827;
      }
      .role-badge {
        display: inline-block;
        background: #3b82f6;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
      }
      .secret-data {
        color: #047857;
        font-weight: 500;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
