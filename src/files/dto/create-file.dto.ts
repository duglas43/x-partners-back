import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  originalname: string;
}
