import { Injectable, OnDestroy } from '@angular/core';
import { Message } from '../interfaces/value-objects/message';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocetMessengerService implements OnDestroy {

  private socket: WebSocket | null = null;
  private url: string = 'wss://192.168.31.43:8080/chatbox';

  public onOpen: Subject<any> = new Subject();
  public onMessage: Subject<Message> = new Subject();
  public onError: Subject<any> = new Subject();
  public onClose: Subject<any> = new Subject();

  public isConnected: boolean = false;

  constructor() {
    this.connect();
  }

  public sendMessage(message: Message) {
    if (this.socket) {
      const jsonString = JSON.stringify(message);
      this.socket.send(jsonString);
      console.log('Send: ', message);
    } else {
      console.error('WebSocket is not connected.');
    }
  }

  public connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = (event) => {
      console.log('Connected to WebSocket:', event);
      this.onOpen.next(event);
    };

    this.socket.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      console.log('Receive:', message);
      this.onMessage.next(message);
    };

    this.socket.onerror = (event) => {
      console.error('WebSocket error:', event);
      this.onError.next(event);
    };

    this.socket.onclose = (event) => {
      this.isConnected = false;
      console.log('WebSocket closed:', event);
      this.onClose.next(event);
    };
  }

  ngOnDestroy() {
    if (this.socket != null)
      this.socket.close();
  }
}
