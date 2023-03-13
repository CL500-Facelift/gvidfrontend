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
  employeeId: number = 1;

  homepagelink: string =  '/homepage';// set the default employee ID here


  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }

  onSubmit() {
    const body = { name: this.name, password: this.password };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.post<any>('http://172.20.10.10:3000/login', JSON.stringify(body), { headers })
      .subscribe(value => {
        if (value.success) {
          this.loginSuccess = true;
          // If login is successful, set the workingTime property for the logged in user
          this.http.post<any>(`http://172.20.10.10:3000/employees/${this.homepagelink}/workingtime`,JSON.stringify({}), { headers })
            .subscribe((data) => {
              this.workingTime = data.workingTime;
              this.loginSuccess = true;

              // Set the employeeId property
              this.authService.setEmployeeId(value.employeeId);

              // Set the username in the AuthService
              this.authService.setUsername(this.name);

              console.log(this.name);
              this.router.navigate([this.homepagelink]);

            });
          this.homepagelink += '/' + this.name;
        } else {
          console.log(value.message);
        }
      });

  }
}
