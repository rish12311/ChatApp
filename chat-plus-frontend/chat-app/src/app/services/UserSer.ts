import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UserSer {
    private username: String | null = "";
    public activeUser: String[] = [];

    setUsername(username: String | null) {
        this.username = username;
    }

    getUsername() {
        return this.username;
    }
}