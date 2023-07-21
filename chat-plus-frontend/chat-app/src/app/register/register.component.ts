import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { apiURL } from '../services/URIser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private http: HttpClient, private router: Router) { }

  regForm = new FormGroup({
    username: new FormControl(""),
    password: new FormControl(""),
  })

  OnReg() {
    this.http.post(`${apiURL}/new/add`, this.regForm.value, { responseType: 'text' }).subscribe((resultData: any) => {
      //console.log(resultData);
    })
    alert("New User Created! Try Logging In");
  }
  onLogin() {
    this.router.navigate(['']);
  }

}
