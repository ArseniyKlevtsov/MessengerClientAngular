import { Component, Input } from '@angular/core';
import { ChatMessageResponseDto } from '../../../shared/interfaces/DTOs/ChatMessages/ChatMessageResponseDto';
import { AuthStorageService } from '../../../shared/services/auth-storage.service';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-message-box',
  standalone: true,
  imports: [NgIf, NgClass, NgFor],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.css'
})
export class MessageBoxComponent {
  @Input() Message!: ChatMessageResponseDto; // Получаем сообщение через Input
  @Input() CurrentUserName!: string; // Имя текущего пользователя

  constructor(
    private authStorageService: AuthStorageService) {
      this.setName();
  }

  setName() {
    const authData = this.authStorageService.getAuthData();
    if (authData == null) {
      return;
    }
    this.CurrentUserName = authData.username;
  }

  isSenderMatch(): boolean {
    return this.Message.SenderName === this.CurrentUserName; // Сравниваем имена
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString(); // Форматируем дату
  }
}
