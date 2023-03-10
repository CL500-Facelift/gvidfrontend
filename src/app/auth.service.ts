import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private username: string | undefined;
  private employeeId: number | undefined;

  constructor() {}

  setUsername(username: string) {
    this.username = username;
  }

  getUsername() {
    return this.username;
  }

  setEmployeeId(employeeId: number) {
    this.employeeId = employeeId;
  }

  getEmployeeId() {
    return this.employeeId;
  }
}
