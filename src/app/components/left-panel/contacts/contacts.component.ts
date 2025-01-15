import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ContactsResponseDto } from '../../../shared/interfaces/DTOs/Contacts/ContactsResponseDto';
import { NgFor } from '@angular/common';
import { ContactContainerComponent } from '../contact-container/contact-container.component';
import { WebsocetMessengerService } from '../../../shared/services/websocet-messenger.service';
import { AuthStorageService } from '../../../shared/services/auth-storage.service';
import { Subscription } from 'rxjs';
import { Message } from '../../../shared/interfaces/value-objects/message';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [NgFor, ContactContainerComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent implements OnInit, OnDestroy {
  @Output() addClicked = new EventEmitter<void>();
  contacts: ContactsResponseDto = { Contacts: [] };

  private messageSubscription!: Subscription;
  private retryCount = 0;
  private maxRetries = 3;

  constructor(
    private websocketService: WebsocetMessengerService,
    private authStorageService: AuthStorageService) {

  }

  ngOnInit(): void {
    this.messageSubscription = this.websocketService.onMessage.subscribe((message: Message) => {
      this.handleMessage(message);
    });

    this.tryLoadContacts();
  }
  private tryLoadContacts(): void {
    if (this.websocketService.isConnected) {
      this.loadContacts();
    } else if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      console.log(`Attempt ${this.retryCount} to load ...`);
      setTimeout(() => this.tryLoadContacts(), 1000);
    } else {
      console.error('Failed to connect after 3 attempts.');
    }
  }

  handleMessage(message: Message): void {
    if (message.Command === "ContactAdded")
      this.ContactAddedHandler(message);
    if (message.Command === "Contacts")
      this.ContactsHandler(message);
  }

  ContactAddedHandler(message: Message): void {
    this.loadContacts();
  }

  ContactsHandler(message: Message): void {
    const newContacts: ContactsResponseDto = message.Dto;
    this.contacts.Contacts = newContacts.Contacts;
    console.log(this.contacts);
}

  onAddClicked(): void {
    this.addClicked.emit();
  }

  loadContacts() {
    const authData = this.authStorageService.getAuthData();
    if (authData == null) { return; }
    const message: Message = {
      Command: "GetContacts",
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
}
