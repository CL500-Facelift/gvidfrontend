import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private username: string = '';

  constructor() { }

  setUsername(username: string) {
    this.username = username;
  }

  getUsername() {
    return this.username;
  }
}
