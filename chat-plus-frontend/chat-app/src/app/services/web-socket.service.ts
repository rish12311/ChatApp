import { Injectable } from '@angular/core';
import { chatMessageDto } from '../models/chatMessageDto';
import { HeaderAuth } from '../models/HeaderAuth'
import { AuthSer } from './AuthSer';
import { HttpHeaders } from '@angular/common/http';
import { wbURL } from './URIser';
import { Socket } from 'ngx-socket-io';
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  webSocket !: WebSocket;
  chatMessages: chatMessageDto[] = [];

  constructor() { }

  public openWebSocket() {

    // const config: HeaderAuth = {
    //   url: 'ws://172.20.10.7:8080/chat',
    //   headers: {
    //     Authorization: 'Bearer' + localStorage.getItem("token")
    //   }
    // };
    //let http_head = new HttpHeaders().set("Authorization", 'Bearer $(localStorage.getItem("token"))');
    //let token = localStorage.getItem("token");

    //const uri = `ws://192.168.215.99:8080/chat/?token=${token}`

    this.webSocket = new WebSocket(`${wbURL}/new/chat`);

    // var ws = new WebSocket("ws://example.com/path", "Bearer " + localStorage.getItem("token"));




    this.webSocket.onopen = (event) => {
      console.log('Open: ', event);
    };

    this.webSocket.onmessage = (event) => {
      const chatMessageDto = JSON.parse(event.data);
      this.chatMessages.push(chatMessageDto);
    };

    this.webSocket.onclose = (event) => {
      console.log('Close: ', event);
    };
  }

  public sendMessage(chatMess: chatMessageDto) {
    if (chatMess.message != null || chatMess.message != " ")
      this.webSocket.send(JSON.stringify(chatMess));
  }

  public closeWebSocket() {
    this.webSocket.close();
  }
}