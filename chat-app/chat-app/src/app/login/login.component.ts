import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthSer } from '../services/AuthSer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router, private auth: AuthSer, private http: HttpClient) {
    //console.log("construct " + localStorage.getItem("token"));
    if (localStorage.getItem("token") != null) {

      this.auth.logoutUser();
    }
  }


  loginForm = new FormGroup({
    username: new FormControl(""),
    password: new FormControl(""),
  })

  ngOnInIt() {
    //console.log(localStorage.getItem("token"));

    if (localStorage.getItem("token") != null) {
      this.auth.logoutUser();
    }
  }

  onRegister() {
    this.router.navigate(['\register']);
  }

  OnSubmit() {
    if (this.loginForm.value != null && this.loginForm.value.username != "" && this.loginForm.value.password != "") {
      this.auth.doLogin(this.loginForm.value).subscribe({
        next: (response: any) => {
          //console.log(response.jwtToken);
          alert("Login Successful!! ");
          this.auth.loginUser(response.jwtToken, response.username);
          this.router.navigate(['\chat']);
        },
        error: error => {
          //console.log(error);
          alert("Credentials Invalid !! ");
        },
      })
    }
    else
      alert("Credentials Cannot Be Empty")
  }
}
