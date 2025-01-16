import { NgFor } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ChatContainerComponent } from '../chat-container/chat-container.component';
import { ContactChatsInfoResponseDto } from '../../../shared/interfaces/DTOs/ContactChats/ContactChatInfoResponseDto ';
import { Subscription } from 'rxjs';
import { WebsocetMessengerService } from '../../../shared/services/websocet-messenger.service';
import { AuthStorageService } from '../../../shared/services/auth-storage.service';
import { Message } from '../../../shared/interfaces/value-objects/message';

@Component({
  selector: 'app-chats-panel',
  standalone: true,
  imports: [NgFor, ChatContainerComponent],
  templateUrl: './chats-panel.component.html',
  styleUrl: './chats-panel.component.css'
})
export class ChatsPanelComponent implements OnInit, OnDestroy {
  chats: ContactChatsInfoResponseDto = { Chats: [] };

  private messageSubscription!: Subscription;
  private retryCount = 0;
  private maxRetries = 3;

  @Output() contactChatClicked = new EventEmitter<string>();

  constructor(
    private websocketService: WebsocetMessengerService,
    private authStorageService: AuthStorageService) {
  }

  ngOnInit(): void {
    this.messageSubscription = this.websocketService.onMessage.subscribe((message: Message) => {
      this.handleMessage(message);
    });

    this.tryLoad();
  }

  private tryLoad(): void {
    if (this.websocketService.isConnected) {
      this.loadChats();
    } else if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      console.log(`Attempt ${this.retryCount} to load ...`);
      setTimeout(() => this.tryLoad(), 1000);
    } else {
      console.error('Failed to connect after 3 attempts.');
    }
  }

  handleMessage(message: Message): void {
    if (message.Command === "ContactChats")
      this.ContactChatsHandler(message);
  }

  ContactChatsHandler(message: Message): void {
    const newContacts: ContactChatsInfoResponseDto = message.Dto;
    this.chats.Chats = newContacts.Chats;
  }

  loadChats() {
    const authData = this.authStorageService.getAuthData();
    if (authData == null) { return; }
    const message: Message = {
      Command: "GetContactChats",
      Dto: {
        UserName: authData.username,
        Password: authData.password,
      }
    };
    this.websocketService.sendMessage(message);
  }
  
  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  onChatClick(chatName: string): void {
    this.contactChatClicked.emit(chatName);
  }
}
