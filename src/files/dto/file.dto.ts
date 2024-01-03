import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class FileDto {
  @ApiProperty({
    type: String,
    format: 'uuid',
  })
  _id: Types.ObjectId;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  originalname: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  mimetype: string;

  constructor(model: Partial<FileDto>) {
    this._id = model?._id;
    this.filename = model?.filename;
    this.originalname = model?.originalname;
    this.size = model?.size;
    this.mimetype = model?.mimetype;
  }
}
