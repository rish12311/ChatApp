import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserSer } from './UserSer';
import { apiURL } from './URIser';

@Injectable({
    providedIn: 'root'
})
export class AuthSer {

    constructor(private http: HttpClient, private userSer: UserSer) { }

    loginUser(token: string, username: string) {
        localStorage.setItem("token", token);
        this.userSer.setUsername(username);
        // localStorage.setItem("username", username);
        return true;
    }
    isLoggedIn() {
        let token = localStorage.getItem("token");
        if (token != null && token != undefined && token != '')
            return true;
        else
            return false;
    }
    logoutUser() {
        localStorage.removeItem("token");
        return true;
    }
    getToken() {
        localStorage.getItem("token");
    }

    doLogin(credentials: any) {
        //console.log(credentials);
        return this.http.post(`${apiURL}/authenticate`, credentials);
    }

}