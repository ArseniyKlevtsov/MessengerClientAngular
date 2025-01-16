import { Component, Input } from '@angular/core';
import { ContactChatInfoResponseDto } from '../../../shared/interfaces/DTOs/ContactChats/ContactChatInfoResponseDto ';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [NgIf],
  templateUrl: './chat-container.component.html',
  styleUrl: './chat-container.component.css'
})
export class ChatContainerComponent {
  @Input() chat!: ContactChatInfoResponseDto; // Объявляем входное свойство

  formatMessage(message: string): string {
    return message.length > 20 ? message.substring(0, 20) + '...' : message;
  }

  formatTime(sentAt: string): string {
    const date = new Date(sentAt);
    const hours = String(date.getHours()).padStart(2, '0'); // Форматируем часы
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Форматируем минуты
    return `${hours}:${minutes}`; // Возвращаем время в формате чч:мм
  }
}
