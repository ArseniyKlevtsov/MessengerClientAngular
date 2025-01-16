import { AuthStorageService } from './../../../shared/services/auth-storage.service';
import { NgFor } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebsocetMessengerService } from '../../../shared/services/websocet-messenger.service';
import { ChatMessageResponseDto } from '../../../shared/interfaces/DTOs/ChatMessages/ChatMessageResponseDto';
import { Subscription } from 'rxjs';
import { Message } from '../../../shared/interfaces/value-objects/message';
import { MessageBoxComponent } from '../message-box/message-box.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgFor, MessageBoxComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() chatName!: string;

  messages: ChatMessageResponseDto[] = [];
  message: string = "";

  private messageSubscription!: Subscription;

  constructor(
    private websocketService: WebsocetMessengerService,
    private authStorageService: AuthStorageService) { }

  ngOnInit() {
    this.messageSubscription = this.websocketService.onMessage.subscribe((message: Message) => {
      this.handleMessage(message);
    });
  }

  handleMessage(message: Message): void {
    if (message.Command === "NewMessage")
      this.NewMessageHandler(message);
    if (message.Command === "Messages")
      this.MessagesHandler(message);
  }

  NewMessageHandler(message: Message): void {
    const newMessage: ChatMessageResponseDto = message.Dto;
    this.messages.push(newMessage);
  }

  MessagesHandler(message: Message): void {

  }

  sendMessage(): void {
    if (this.message.trim()) {

      const authData = this.authStorageService.getAuthData();
      if (authData == null) { return; }
      const message: Message = {
        Command: "SendChatMessage",
        Dto: {
          UserName: authData.username,
          Password: authData.password,
          Content: this.message,
          HasMedia: false,
          ContactName: this.chatName,
        }
      };
      this.websocketService.sendMessage(message);
      this.message = '';
    }
  }

  addMedia(): void {

  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }
}
