import { ContactsResponseDto } from './../../interfaces/DTOs/Contacts/ContactsResponseDto';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToolPanelComponent } from '../../../components/left-panel/tool-panel/tool-panel.component';
import { ChatsPanelComponent } from '../../../components/left-panel/chats-panel/chats-panel.component';
import { ContactsComponent } from '../../../components/left-panel/contacts/contacts.component';
import { NgIf } from '@angular/common';
import { ChatComponent } from "../../../components/right-panel/chat/chat.component";
import { ProfileComponent } from "../../../components/right-panel/profile/profile.component";
import { CreateGroupChatComponent } from '../../../components/right-panel/create-group-chat/create-group-chat.component';
import { AddContactComponent } from '../../../components/right-panel/add-contact/add-contact.component';
import { Message } from '../../interfaces/value-objects/message';
import { WebsocetMessengerService } from '../../services/websocet-messenger.service';
import { AuthStorageService } from '../../services/auth-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterModule, 
    ToolPanelComponent, 
    ChatsPanelComponent, 
    ContactsComponent, 
    NgIf, 
    ChatComponent, 
    ProfileComponent, 
    CreateGroupChatComponent, 
    AddContactComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  selectedOptionLeft: string = "chats";
  selectedOptionRigth: string = "profile";

  

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
  }

  onOptionSelected(option: string): void {
    console.log('Выбранный вариант:', option);
    this.selectedOptionLeft = option;
  }
  
  onProfileClicked(): void {
    console.log('Кнопка Профиль нажата');
    // Логика для обработки нажатия кнопки
  }

  onAddClicked(): void {
    this.selectedOptionRigth = "addContact";
  }

  loadContacts() {
    const authData = this.authStorageService.getAuthData();
    if( authData == null) {return;}
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
