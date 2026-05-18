import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <h2>System Authentication</h2>
      <p>Select a role to simulate login:</p>

      <div class="button-group">
        <button
          class="btn-admin"
          data-test-id="login-btn"
          (click)="loginAs('ADMIN')"
        >
          Login as ADMIN
        </button>

        <button class="btn-user" (click)="loginAs('USER')">
          Login as USER (Restricted)
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        max-width: 400px;
        margin: 80px auto;
        text-align: center;
        font-family: 'Inter', sans-serif;
        background: #f9fafb;
        padding: 40px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      h2 {
        color: #111827;
        margin-top: 0;
      }
      p {
        color: #6b7280;
        margin-bottom: 24px;
      }
      .button-group {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      button {
        padding: 12px;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        color: white;
      }
      .btn-admin {
        background-color: #10b981;
      }
      .btn-admin:hover {
        background-color: #059669;
      }
      .btn-user {
        background-color: #6b7280;
      }
      .btn-user:hover {
        background-color: #4b5563;
      }
    `,
  ],
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  loginAs(role: 'ADMIN' | 'USER') {
    this.authService.login(role);
    this.router.navigate(['/dashboard']);
  }
}
