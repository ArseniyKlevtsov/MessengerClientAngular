import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WebsocetMessengerService } from '../../../shared/services/websocet-messenger.service';
import { AuthStorageService } from '../../../shared/services/auth-storage.service';
import { Message } from '../../../shared/interfaces/value-objects/message';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.css'
})
export class AddContactComponent implements OnInit, OnDestroy {
  contactForm: FormGroup;
  error: string = '';

  requestSended: boolean = false;
  private messageSubscription!: Subscription;

  constructor(
    private websocketService: WebsocetMessengerService,
    private authStorageService: AuthStorageService,
    private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.messageSubscription = this.websocketService.onMessage.subscribe((message: Message) => {
      this.handleMessage(message);
    });
  }

  handleMessage(message: Message): void {
    if (message.Command === "AddContactError")
      this.AddContactErrorHandler(message);
  }

  AddContactErrorHandler(message: Message): void {
    this.error = message.Dto.ErrorMessage;
    this.requestSended = false;
  }

  onSubmit(): void {
    const authData = this.authStorageService.getAuthData();
    if( authData == null) {
      this.error = 'Вам нужно залогиниться';
      return;
    }
    if (this.contactForm.valid) {

      this.error = '';

      this.requestSended = true;

      const message: Message = {
        Command: "AddContact",
        Dto: {
          ContactName: this.contactForm.value.name,
          UserName: authData.username,
          Password: authData.password,
        }
      };
      this.websocketService.sendMessage(message);

      this.contactForm.reset();
    }
    else {
      this.error = "Пожалуйста, заполните все поля.";
    }
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }
}
