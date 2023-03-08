import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  name: any;
  password: any;
  loginSuccess: boolean = false;


  constructor(private http: HttpClient, private router: Router) { }


  onSubmit() {
    const body = { name: this.name, password: this.password };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.post<any>('http://localhost:3000/login', JSON.stringify(body), {headers: headers})
      .subscribe(value => {
        if (value.success) {
          this.loginSuccess = true;
        }
        }

      );
  }
}
