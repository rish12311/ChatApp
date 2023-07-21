import { Component, ViewChild, ElementRef } from '@angular/core';
import Peer from "peerjs";
import { UserSer } from '../services/UserSer';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthSer } from '../services/AuthSer';
import { Router } from '@angular/router';
import { apiURL } from '../services/URIser';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.css']
})
export class VideoChatComponent {


  @ViewChild('localVideo') localVideoRef!: ElementRef;

  private peer: Peer;
  peerIdShare: string = "";
  peerId: string = "";
  private lazyStream: any;
  currentPeer: any;
  private peerList: Array<any> = [];
  activeCall: any = null;
  arr1: any[] = [];
  status: boolean = false;
  customId: String | null = this.userSer.getUsername();
  name: String = "";


  constructor(private userSer: UserSer, private http: HttpClient, private auth: AuthSer, private router: Router) {

    this.customId != userSer.getUsername();
    this.peer = new Peer();
  }
  ngAfterViewInit(): void {
    this.setupLocalVideo();
  }

  ngOnDestroy(): void {

    const localVideoElement: HTMLVideoElement = this.localVideoRef.nativeElement;
    if (localVideoElement.srcObject) {
      const stream = localVideoElement.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track: MediaStreamTrack) => {
        console.log(track);
        track.stop();
        track.enabled = false;
        track.muted;

        console.log(track);

      });


      localVideoElement.srcObject = null;
    }
    let active = this.userSer.getUsername();
    //console.log(active);

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem("token") // Replace with your actual authentication token
    });
    this.http.delete(`${apiURL}/deletedoctor/` + active, { headers }).subscribe({
      next: (resultData: any) => {
      },
      error: error => {
        if (error.status == 200) {
          //console.log("Deleted");


        }
      },
    })

  }

  isFrozen: boolean = true; // or false, depending on your initial state

  // Function or event handler to toggle the frozen state
  toggleFrozenState() {
    this.isFrozen = !this.isFrozen;
  }

  SelectedUser(arrr1: any) {

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem("token") // Replace with your actual authentication token
    });

    this.http.get(`${apiURL}/getdoctorid/` + arrr1, { headers }).subscribe({
      next: (resultData: any) => {
        this.peerIdShare = resultData;
        this.name = arrr1;

      },
      error: error => {
        console.log(error);
        this.peerIdShare = error.error.text;
        this.name = arrr1;
      },
    })
  }

  private setupLocalVideo(): void {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        const localVideoElement: HTMLVideoElement = this.localVideoRef.nativeElement;
        localVideoElement.srcObject = stream;
        localVideoElement.play();
      })
      .catch((error) => {
        console.log('Error accessing local media devices:', error);
      });
  }

  isLoggedIn(arrr1: any) {

    if (arrr1.username == this.userSer.getUsername()) {
      return false;
    }
    else {
      if (arrr1.status == true) {
        return false;
      }
      else {
        return true;
      }
    }

  }

  ngOnInit(): void {
    this.getPeerId();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token") // Replace with your actual authentication token
    });

    setTimeout(() => {

      let active: any =
        { username: this.userSer.getUsername(), id: this.peerId, status: this.status }
        ;

      //console.log(active)
      this.http.post(`${apiURL}/adddoctor`, active, { headers }).subscribe((resultData: any) => {
        //console.log(resultData);
      })
    }, 3000)

    setTimeout(() => {
      this.http.get(`${apiURL}/getalldoctor`, { headers }).subscribe((resultData: any) => {
        //console.log(resultData);
        this.arr1 = resultData;
      });

      //console.log(this.arr1);


    }, 4000)
  }

  refreshSection() {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem("token") // Replace with your actual authentication token
    });
    this.arr1 = [];

    this.http.get(`${apiURL}/getalldoctor`, { headers }).subscribe((resultData: any) => {
      //console.log(resultData);
      this.arr1 = resultData;
    });

  }

  private getPeerId = () => {
    this.peer.on('open', (id) => {
      this.peerId = id;
    });

    this.peer.on('call', (call) => {
      if (this.activeCall) {
        // Busy, reject the call
        call.close();
        return;
      }

      this.activeCall = call;

      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      }).then((stream) => {
        this.lazyStream = stream;

        const confirmCall = confirm("Accept incoming call?");
        if (confirmCall) {
          this.answerCall();
        } else {
          call.close();
          this.activeCall = null;
        }

        call.on('close', () => {
          this.activeCall = null;
        });

        call.on('stream', (remoteStream) => {
          if (!this.peerList.includes(call.peer)) {
            this.streamRemoteVideo(remoteStream);
            this.currentPeer = call.peerConnection;
            this.peerList.push(call.peer);
            console.log(this.peerList);
          }
        });
      }).catch(err => {
        console.log(err + 'Unable to get media');
      });
    });
  }

  connectWithPeer(): void {
    this.callPeer(this.peerIdShare);
    this.updateStat();
  }

  private callPeer(id: string): void {
    if (this.activeCall) {
      console.log("Already on a call");
      return;
    }

    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then((stream) => {
      this.lazyStream = stream;

      const call = this.peer.call(id, stream);
      this.activeCall = call;

      call.on('close', () => {
        this.activeCall = null;
      });

      call.on('stream', (remoteStream) => {
        if (!this.peerList.includes(call.peer)) {
          this.streamRemoteVideo(remoteStream);
          this.currentPeer = call.peerConnection;
          this.peerList.push(call.peer);
        }
      });
    }).catch(err => {
      console.log(err + 'Unable to connect');
    });
  }

  updateStat() {
    let active: any =
      { status: !this.status }
      ;
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem("token") // Replace with your actual authentication token
    });

    this.http.put(`${apiURL}/updateinfo/` + this.userSer.getUsername(), active, { headers }).subscribe({
      next: (resultData: any) => {
        //console.log(resultData);

      },
      error: error => {
        console.log(error);
        if (error.status == 200)
          console.log("updated");

      },
    })
  }

  answerCall(): void {


    if (this.activeCall) {
      const call = this.activeCall;
      this.activeCall = null;
      call.answer(this.lazyStream);

      call.on('stream', (remoteStream: MediaStream) => {
        if (!this.peerList.includes(call.peer)) {
          this.streamRemoteVideo(remoteStream);
          this.currentPeer = call.peerConnection;
          this.peerList.push(call.peer);
        }
      });
    }
    this.name = this.peerIdShare;
  }

  declineCall(): void {
    if (this.activeCall) {
      this.activeCall.close();
      this.activeCall = null;

      // if (this.lazyStream) {
      //   const tracks = this.lazyStream.getTracks();
      //   tracks.forEach((track: { stop: () => void; }) => {
      //     track.stop();
      //   });
      // }
    }
  }

  private streamRemoteVideo(stream: any): void {
    const video = document.createElement('video');
    video.classList.add('video');
    video.srcObject = stream;
    video.play();

    document.getElementById('remote-video')!.append(video);
  }


  shareScreen() {
    // @ts-ignore
    navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: {
        echoCancellation: true,
        noiseSuppression: true
      }
    }).then(stream => {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.onended = () => {
        this.stopScreenShare();
      };

      const sender = this.currentPeer.getSenders().find((s: any) => s.track?.kind === videoTrack.kind); // Add the type "any" to fix the error
      sender.replaceTrack(videoTrack);
    }).catch(err => {
      console.log('Unable to get display media ' + err);
    });
  }

  private stopScreenShare() {
    const videoTrack = this.lazyStream.getVideoTracks()[0];
    const sender = this.currentPeer.getSenders().find((s: { track: { kind: any; }; }) => s.track.kind === videoTrack.kind);
    sender.replaceTrack(videoTrack);
  }
}
