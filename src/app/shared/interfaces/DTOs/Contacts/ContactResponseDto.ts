export interface ContactResponseDto {
    IsBlocked: boolean; // Свойство, указывающее, заблокирован ли контакт
    Name: string;      // Имя контакта
    Status: string;    // Статус контакта
    IconUrl: string;   // URL-адрес иконки контакта
  }