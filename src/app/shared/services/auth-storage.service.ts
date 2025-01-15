import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {
  private readonly storageKey = 'authData';

  constructor() {}

  // Создание или обновление данных
  setAuthData(username: string, password: string): void {
    const authData = { username, password };
    localStorage.setItem(this.storageKey, JSON.stringify(authData));
  }

  // Чтение данных
  getAuthData(): { username: string; password: string } | null {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  // Удаление данных
  clearAuthData(): void {
    localStorage.removeItem(this.storageKey);
  }

  isLoggedIn(): boolean {
    return !!this.getAuthData();
  }
}
