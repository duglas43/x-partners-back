import { ApiProperty } from '@nestjs/swagger';
import { GENDER } from '../enums';
import { Types } from 'mongoose';
import { FileDto } from 'src/files/dto';
import { File } from 'src/files/schemas/file.schema';

export class UserDto {
  @ApiProperty({
    type: String,
    format: 'uuid',
  })
  _id: Types.ObjectId;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  birthday: Date;

  @ApiProperty({
    enum: GENDER,
  })
  gender: string;

  @ApiProperty({
    type: FileDto,
  })
  photo: File;

  constructor(partial: Partial<UserDto>) {
    this._id = partial?._id;
    this.name = partial?.name;
    this.email = partial?.email;
    this.birthday = partial?.birthday;
    this.gender = partial?.gender;
    this.photo = new FileDto(partial?.photo);
  }
}
