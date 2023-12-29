import { IsString, IsNotEmpty, IsDate, IsEmail, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GENDER } from 'src/users/enums';
export class SignUpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  birthday: Date;

  @ApiProperty({
    enum: GENDER,
  })
  @IsEnum(GENDER)
  gender: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  photo: string;
}
