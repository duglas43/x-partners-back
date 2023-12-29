import { IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFileDto {
  @ApiPropertyOptional()
  @IsString()
  originalname: string;
}
