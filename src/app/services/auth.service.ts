import { Injectable } from '@angular/core';
import { User } from '../types/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: User | null = null;

  login(role: 'ADMIN' | 'USER') {
    this.currentUser = { username: 'Admin', role };
  }

  logout() {
    this.currentUser = null;
  }

  getUser(): User | null {
    return this.currentUser;
  }
}
