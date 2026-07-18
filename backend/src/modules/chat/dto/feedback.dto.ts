import { IsString, IsOptional, IsIn } from 'class-validator';

export class FeedbackDto {
  @IsString()
  messageId: string;

  @IsString()
  @IsIn(['like', 'dislike'])
  rating: string;

  @IsString()
  @IsOptional()
  @IsIn(['inaccurate', 'incomplete', 'irrelevant', 'other'])
  reason?: string;
}
