import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GENDER } from '../enums';
import { HydratedDocument } from 'mongoose';
import { File } from '../../files/schemas/file.schema';
import * as mongoose from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({
    unique: true,
    required: true,
    validate: {
      validator: (v: string) => {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: (props: any) => `${props.value} is not a valid email!`,
    },
  })
  email: string;

  @Prop()
  password: string;

  @Prop()
  refreshToken: string;

  @Prop()
  birthday: Date;

  @Prop({
    enum: GENDER,
  })
  gender: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'File' })
  photo: File;
}

export const UserSchema = SchemaFactory.createForClass(User);
