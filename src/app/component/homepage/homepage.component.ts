import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit{
  worktime: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // retrieve the employee ID from local storage or another source
    const employeeId = localStorage.getItem('employeeId');

    // make an HTTP GET request to the server to fetch the work time data for the logged-in employee
    this.http.get<any[]>(`http://localhost:3000/worktime/${employeeId}`).subscribe(
      data => {
        this.worktime = data;
      },
      error => {
        console.log(error);
      }
    );
  }
}
