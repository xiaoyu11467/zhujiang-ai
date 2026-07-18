import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  question: string;

  @IsString()
  @IsOptional()
  sessionId?: string;

  @IsString()
  @IsOptional()
  conversationId?: string;
}
