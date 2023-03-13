import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService} from "../../auth.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  loading = true;
  employee: { name: string; working_time: string; } | undefined;

  constructor(private http: HttpClient,     private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    this.http
      .get<{ name: string; working_time: string }>(
        `http://192.168.178.171:3000/workingtime/${name}`
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
