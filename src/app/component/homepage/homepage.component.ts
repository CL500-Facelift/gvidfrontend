import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService} from "../../auth.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  loading = true;
  employee: { name: string; working_time: string; } | undefined;

  constructor(private http: HttpClient,     private authService: AuthService
  ) {}

  ngOnInit() {
    const name = 'John Doe'; // replace with the actual employee ID
    this.http
      .get<{ name: string; working_time: string }>(
        `http://172.23.0.135:3000/workingtime/${name}`
      )
      .subscribe(
        (data) => {
          this.loading = false;
          this.employee = data;
        },
        (error) => {
          console.error(error);
          this.loading = false;
        }
      );
  }

}
