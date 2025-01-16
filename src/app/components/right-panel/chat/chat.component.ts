import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  @Input() chatName!: string;

  message: string = '';
  mediaList: string[] = []; // Здесь будут храниться загруженные медиа
  messages: string[] = []; // Здесь будут храниться сообщения

  sendMessage(): void {
    if (this.message.trim()) {
      this.messages.push(this.message); // Добавляем сообщение в массив
      this.message = ''; // Очищаем поле ввода
    }
  }

  addMedia(): void {
    const mediaName = prompt('Введите имя медиа');
    if (mediaName) {
      this.mediaList.push(mediaName); // Добавляем медиа в список
    }
  }
}
