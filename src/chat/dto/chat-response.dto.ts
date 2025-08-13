export class ChatResponseDto {
  id: number;
  user1: any;
  user2: any;
  messages: MessageDto[];
  createdAt: Date;
  updatedAt: Date;
}

export class MessageDto {
  id: number;
  content: string;
  createdAt: Date;
  sender: any;
  read: boolean;
}
