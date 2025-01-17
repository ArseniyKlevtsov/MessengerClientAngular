import { ChatMessagesResponseDto } from './../../../shared/interfaces/DTOs/ChatMessages/ChatMessagesResponseDto';
import { AuthStorageService } from './../../../shared/services/auth-storage.service';
import { NgFor } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
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
export class ChatComponent implements OnInit, OnDestroy, OnChanges {
  @Input() chatName!: string;

  messages: ChatMessageResponseDto[] = [];
  message: string = "";

  private messageSubscription!: Subscription;
  private retryCount = 0;
  private maxRetries = 3;

  constructor(
    private websocketService: WebsocetMessengerService,
    private authStorageService: AuthStorageService) { }

  ngOnInit() {
    this.messageSubscription = this.websocketService.onMessage.subscribe((message: Message) => {
      this.handleMessage(message);
    });

    this.tryLoadMessages();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['chat Name']) {
      this.onChatNameChange(changes['chat Name'].currentValue);
    }
  }

  private onChatNameChange(newChatName: string) {
    console.log('chatName изменен на:', newChatName);
    this.messages = [];
    this.tryLoadMessages();
  }

  loadChatMessages() {
    const authData = this.authStorageService.getAuthData();
    if (authData == null) { return; }
    const message: Message = {
      Command: "LoadChatMessages",
      Dto: {
        UserName: authData.username,
        Password: authData.password,
        ContactName: this.chatName
      }
    };
    this.websocketService.sendMessage(message);
  }

  public tryLoadMessages(): void {
    if (this.websocketService.isConnected) {
      this.loadChatMessages();
    } else if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      console.log(`Attempt ${this.retryCount} to load ...`);
      setTimeout(() => this.loadChatMessages(), 1000);
    } else {
      console.error('Failed to connect after 3 attempts.');
    }
  }

  handleMessage(message: Message): void {
    if (message.Command === "NewMessage")
      this.NewMessageHandler(message);
    if (message.Command === "Messages")
      this.MessagesHandler(message);
  }

  NewMessageHandler(message: Message): void {
    const newMessage: ChatMessageResponseDto = message.Dto;
    if (newMessage.ContactName === this.chatName || newMessage.SenderName === this.chatName) {
      this.messages.push(newMessage);
    }
  }

  MessagesHandler(message: Message): void {
    const newMessages: ChatMessagesResponseDto = message.Dto;
    this.messages = newMessages.Messages;
    const messagesList = document.querySelector('.messages-list');
    if (messagesList) {
      messagesList.scrollTop = messagesList.scrollHeight;
    }
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
