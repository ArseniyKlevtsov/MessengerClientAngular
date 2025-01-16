export interface ContactChatInfoResponseDto {
  Name: string;         // Имя контакта
  Status: string;       // Статус контакта
  LastMessage: string;  // Последнее сообщение
  MessageStatus: string; // Статус сообщения (например, "прочитано", "не прочитано")
  SentAt: string;      // URL изображения контакта
  IconUrl: string;      // URL изображения контакта
}

export interface ContactChatsInfoResponseDto {
  Chats: ContactChatInfoResponseDto[]; // Список контактов
}