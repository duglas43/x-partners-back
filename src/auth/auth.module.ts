import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { MulterConfigModule } from 'src/multer-config/multer-config.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    MulterConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.register({}),
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    FilesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
