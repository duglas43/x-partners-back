import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { SignInDto, SignUpDto, AccessDto, RefreshDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private filesService: FilesService,
  ) {}

  async signUp(dto: SignUpDto) {
    const candidate = await this.userModel.findOne({ email: dto.email });
    if (candidate) {
      throw new BadRequestException(
        `User with email ${dto.email} already exists`,
      );
    }
    const createdFile = await this.filesService.create(dto.photo, {});
    const hashPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.userModel.create({
      ...dto,
      photo: createdFile._id,
      password: hashPassword,
    });
    const refresh_token = await this.signRefreshToken({
      id: user.id,
      email: user.email,
    });
    await user.updateOne({ refreshToken: refresh_token });
    const access_token = await this.signAccessToken({
      id: user.id,
      email: user.email,
    });
    return {
      access_token,
      refresh_token,
    };
  }

  async signIn(dto: SignInDto) {
    const user = await this.userModel.findOne({
      email: dto.email,
    });
    if (!user) {
      throw new ForbiddenException('Incorrect email or password');
    }
    const isCorrectPassword = await bcrypt.compare(dto.password, user.password);
    if (!isCorrectPassword) {
      throw new ForbiddenException('Incorrect email or password');
    }
    const access_token = await this.signAccessToken({
      id: user.id,
      email: user.email,
    });
    const refresh_token = await this.signRefreshToken({
      id: user.id,
      email: user.email,
    });
    await user.updateOne({ refreshToken: refresh_token });
    return {
      access_token,
      refresh_token,
    };
  }

  async refresh(dto: RefreshDto) {
    const user = await this.userModel.findOne({
      refreshToken: dto.refresh_token,
    });
    if (!user) {
      throw new ForbiddenException('Incorrect refresh token');
    }
    const access_token = await this.signAccessToken({
      id: user.id,
      email: user.email,
    });
    const refresh_token = await this.signRefreshToken({
      id: user.id,
      email: user.email,
    });
    await user.updateOne({ refresh_token });
    return {
      access_token,
      refresh_token,
    };
  }

  async logout(userId: number) {
    const user = await this.userModel.findById(userId);
    await user.updateOne({ refreshToken: null });
    return new AccessDto(null);
  }

  async signAccessToken(dto: { id: number; email: string }) {
    const payload = { email: dto.email, sub: dto.id };
    const secret = this.configService.get('JWT_ACCESS_TOKEN_SECRET');
    return this.jwtService.sign(payload, {
      expiresIn: '365d',
      secret,
    });
  }

  async signRefreshToken(dto: { id: number; email: string }) {
    const payload = { email: dto.email, sub: dto.id };
    const secret = this.configService.get('JWT_REFRESH_TOKEN_SECRET');
    return this.jwtService.sign(payload, {
      expiresIn: '365d',
      secret,
    });
  }
}
