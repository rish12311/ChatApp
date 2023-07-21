import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { WebSocketService } from '../services/web-socket.service';
import { chatMessageDto } from '../models/chatMessageDto';
import { AuthSer } from '../services/AuthSer';
import { Router } from '@angular/router';
import { UserSer } from '../services/UserSer';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  constructor(public webSocketService: WebSocketService, private auth: AuthSer, private router: Router, private userSer: UserSer) {
  }

  s: String | null = "hello";

  isFrozen: boolean = false; // or false, depending on your initial state

  // Function or event handler to toggle the frozen state
  toggleFrozenState() {
    this.isFrozen = !this.isFrozen;
  }

  ngOnInit(): void {
    this.webSocketService.openWebSocket();
    // this.s = localStorage.getItem("username");
    // this.userSer.setUsername(this.s);

    this.s = this.userSer.getUsername();
    //console.log(this.s);
    const chatMes = new chatMessageDto("admin", this.s + " Has Joined The Conversation");
    setTimeout(() => {
      this.webSocketService.sendMessage(chatMes);
    }, 2000)



    if (localStorage.getItem("token") == null || this.s == "" || this.s == null) {
      this.router.navigate(['/']);
    }
    this.toggleFrozenState();


    //this.userSer.activeUser.push(this.userSer.getUsername());

  }

  ngOnDestroy(): void {
    this.webSocketService.closeWebSocket();


  }
  VideoChat() {
    if (localStorage.getItem("token") == null || this.s == "" || this.s == null) {
      this.router.navigate(['/']);
    }
    else
      this.router.navigate(['\video'])
  }
  LogOut() {
    this.auth.logoutUser();
    this.router.navigate(['/']);
  }


  sendMessage(sendForm: NgForm) {
    this.s = this.userSer.getUsername();
    //console.log(this.userSer.getUsername());
    if (sendForm.value.message != " " || sendForm.value.message != null) {
      const chatMes = new chatMessageDto(sendForm.value.user, sendForm.value.message);
      this.webSocketService.sendMessage(chatMes);
      //console.log(sendForm.value);
    }
    sendForm.controls['message'].reset();
  }
}
