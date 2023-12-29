import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GENDER } from '../enums';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: Types.ObjectId;

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

  @Prop()
  photo: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
