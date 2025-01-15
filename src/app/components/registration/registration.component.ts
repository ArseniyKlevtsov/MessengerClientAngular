import { NgIf } from '@angular/common';
import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { WebsocetMessengerService } from '../../shared/services/websocet-messenger.service';
import { Message } from '../../shared/interfaces/value-objects/message';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit, OnDestroy {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  error: string = '';

  requestSended: boolean = false;
  private messageSubscription!: Subscription;

  constructor(
    private websocketService: WebsocetMessengerService,
    private router: Router) { }

  ngOnInit() {
    this.messageSubscription = this.websocketService.onMessage.subscribe((message: Message) => {
      this.handleMessage(message);
    });
  }

  handleMessage(message: Message): void {
    if (message.Command === "UserRegistered")
      this.UserRegisteredHandler(message);
  }

  UserRegisteredHandler(message: Message): void {
    this.router.navigate(['/login'], { queryParams: { username: message.Dto.UserName, password: message.Dto.Password } });
  }

  handleRegister(form: NgForm) {
    if (form.invalid) {
      this.error = 'Пожалуйста, заполните все поля.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Пароли не совпадают.';
      return;
    }

    this.error = '';

    this.requestSended = true;

    const message: Message = {
      Command: "RegisterUser",
      Dto: {
        UserName: this.username,
        Password: this.password,
      }
    };
    this.websocketService.sendMessage(message);

    console.log('Регистрация:', { username: this.username, password: this.password });
  }

  handleLogin() {
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }
}
