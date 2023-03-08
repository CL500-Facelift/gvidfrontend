import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService} from "../../auth.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  worktime: any;
  username = '';


  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {
    const name = this.authService.getUsername();
    console.log(name); // check the value of name in the console
    if (name) {
      const url = `http://localhost:3000/employees/${name}/workingtime`;
      this.http.get<any>(url).subscribe(response => {
        this.worktime = response;
      }, error => {
        console.error(error);
      });
    }
  }

}
