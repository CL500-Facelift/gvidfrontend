import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'gvidfrontend';
  employee: Observable<any> = this.httpclient.get("http://172.23.0.135:3000/employees");


  constructor(private httpclient: HttpClient) {
      this.employee.subscribe(value => {console.log(value)})
  }
}
