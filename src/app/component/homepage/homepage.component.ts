import { Component, OnInit } from '@angular/core';

import { AuthService } from "../../auth.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  name: string | undefined;
  employeeId: number | undefined;
  workingTime: number | undefined;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.name = this.authService.getUsername();
    this.employeeId = this.authService.getEmployeeId();
    this.authService.getWorkingTime(this.name).subscribe(data => {
      this.workingTime = data.workingTime;
    });
  }

  startWorkingTime() {
    this.authService.startWorkingTime(this.name).subscribe(data => {
      console.log(data.message);
    });
  }

  endWorkingTime() {
    this.authService.endWorkingTime(this.name).subscribe(data => {
      console.log(data.message);
    });
  }

}
