import { Component, ViewChild} from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToolPanelComponent } from '../../../components/left-panel/tool-panel/tool-panel.component';
import { ChatsPanelComponent } from '../../../components/left-panel/chats-panel/chats-panel.component';
import { ContactsComponent } from '../../../components/left-panel/contacts/contacts.component';
import { NgIf } from '@angular/common';
import { ChatComponent } from "../../../components/right-panel/chat/chat.component";
import { ProfileComponent } from "../../../components/right-panel/profile/profile.component";
import { CreateGroupChatComponent } from '../../../components/right-panel/create-group-chat/create-group-chat.component';
import { AddContactComponent } from '../../../components/right-panel/add-contact/add-contact.component';


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
export class MainLayoutComponent {
  @ViewChild(ChatComponent) chatComponent!: ChatComponent;

  selectedOptionLeft: string = "chats";
  selectedOptionRigth: string = "profile";

  contactChatName: string = "";

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

  onContactChatClicked(chatName: string): void {
    this.contactChatName = chatName;
    this.selectedOptionRigth = "chat";
    this.chatComponent.messages = [];
    this.chatComponent.tryLoadMessages();
  }
}
