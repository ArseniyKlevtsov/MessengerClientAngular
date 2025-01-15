import { Component, Input } from '@angular/core';
import { ContactResponseDto } from '../../../shared/interfaces/DTOs/Contacts/ContactResponseDto';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-contact-container',
  standalone: true,
  imports: [NgIf],
  templateUrl: './contact-container.component.html',
  styleUrl: './contact-container.component.css'
})
export class ContactContainerComponent {
  @Input() contact!: ContactResponseDto; // Объявляем входное свойство
}
