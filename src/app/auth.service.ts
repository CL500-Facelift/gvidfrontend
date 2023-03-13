import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://192.168.178.171:3000';

  private employeeId: number | undefined;
  private username: string | undefined;

  constructor(private http: HttpClient) { }

  setEmployeeId(employeeId: number) {
    this.employeeId = employeeId;
  }

  getEmployeeId() {
    return this.employeeId;
  }

  setUsername(username: string) {
    this.username = username;
  }

  getUsername() {
    return this.username;
  }


  startWorkingTime(username: string | undefined): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.apiUrl}/employees/${username}/workingtime/start`, {}, { headers });
  }

  endWorkingTime(username: string | undefined): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.apiUrl}/employees/${username}/workingtime/end`, {}, { headers });
  }

  getWorkingTime(username: string | undefined): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<any>(`${this.apiUrl}/employees/${username}/workingtime`, { headers });
  }
}
