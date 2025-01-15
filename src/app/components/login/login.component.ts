import { AuthStorageService } from './../../shared/services/auth-storage.service';
import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WebsocetMessengerService } from '../../shared/services/websocet-messenger.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from '../../shared/interfaces/value-objects/message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  requestSended: boolean = false;
  private messageSubscription!: Subscription;

  constructor(
    private authStorageService: AuthStorageService,
    private route: ActivatedRoute,
    private websocketService: WebsocetMessengerService,
    private router: Router) { }

  ngOnInit() {
    this.messageSubscription = this.websocketService.onMessage.subscribe((message: Message) => {
      this.handleMessage(message);
    });
    this.route.queryParams.subscribe(params => {
      this.username = params['username'] || '';
      this.password = params['password'] || '';
    });
  }

  handleMessage(message: Message): void {
    if (message.Command === "SuccesLogin")
      this.SuccesLoginHandler(message);
    if (message.Command === "LoginError")
      this.LoginErrorHandler(message);
  }

  LoginErrorHandler(message: Message): void {
    this.error = message.Dto.ErrorMessage;
    this.requestSended = false;
  }

  SuccesLoginHandler(message: Message): void {
    this.authStorageService.setAuthData(message.Dto.UserName, message.Dto.Password)
    this.router.navigate(['/main']);
  }

  handleLogin(form: NgForm) {
    if (form.invalid) {
      this.error = 'Пожалуйста, заполните все поля.';
      return;
    }

    this.error = '';

    this.requestSended = true;

    const message: Message = {
      Command: "Login",
      Dto: {
        UserName: this.username,
        Password: this.password,
      }
    };
    this.websocketService.sendMessage(message);
  }

  handleRegister() {
    this.router.navigate(['/register']);
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }
}
