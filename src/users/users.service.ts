import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { UpdateUserDto, UserDto } from './dto';
import { Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll() {
    const users = await this.userModel.find().populate('photo').exec();
    return users.map((user) => new UserDto(user));
  }
  async findAllExceptMe(user: UserDto) {
    const users = await this.userModel
      .find({ _id: { $ne: user._id } })
      .populate('photo')
      .exec();
    return users.map((user) => new UserDto(user));
  }

  async findOne(id: Types.ObjectId) {
    const user = await this.userModel.findById(id).populate('photo').exec();
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return new UserDto(user);
  }

  async update(id: Types.ObjectId, updateUserDto: UpdateUserDto) {
    const user = await this.userModel
      .findByIdAndUpdate(id, { $set: updateUserDto }, { new: true })
      .populate('photo')
      .exec();
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return new UserDto(user);
  }

  async remove(id: Types.ObjectId) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    await user.deleteOne();
  }
}
