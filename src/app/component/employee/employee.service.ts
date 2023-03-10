import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService} from "../../auth.service";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  apiUrl = 'http://172.20.10.10:3000';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getEmployeeData(employeeName: string): Observable<any> {
    const url = `${this.apiUrl}/employees/${employeeName}/timetable`;
    return this.http.get<any>(url);
  }

  getUsername(): string {
    return <string>this.authService.getUsername();
  }
}
