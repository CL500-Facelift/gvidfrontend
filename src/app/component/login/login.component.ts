import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from "../../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  name: any;
  password: any;
  loginSuccess: boolean = false;
  workingTime!: number;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }

  onSubmit() {
    const body = { name: this.name, password: this.password };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.post<any>('http://localhost:3000/login', JSON.stringify(body), { headers })
      .subscribe((response) => {
        if (response.success) {
          // If login is successful, set the workingTime property for the logged in user
          this.http.get<any>(`http://localhost:3000/employees/${this.name}/workingtime`)
            .subscribe((data) => {
              this.workingTime = data.workingTime;
              this.loginSuccess = true;

              // Set the username in the AuthService
              this.authService.setUsername(this.name);

              // Navigate to the homepage
              this.router.navigate(['/homepage']);
            });
        } else {
          console.log(response.message);
        }
      });
  }
}
