export interface ChatMessageResponseDto {
    Content: string;             // Содержимое сообщения
    HasMedia: boolean;           // Наличие медиа
    SentAt: Date;                // Дата и время отправки
    Status: string;              // Статус сообщения (например, "sent", "delivered")
    SenderName: string;          // Имя отправителя
    ContactName?: string;        // Имя контакта (опционально)
    GroupName?: string;          // Имя группы (опционально)
    MediaUrls: string[];         // Список URL медиа
}