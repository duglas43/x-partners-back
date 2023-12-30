import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  ParseFilePipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SignInDto, SignUpDto, AccessDto } from './dto';
import { Response, Request } from 'express';
import { GetUser } from './decorator';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { Public } from './decorator/public.decorator';

@Public()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ type: AccessDto })
  @ApiBadRequestResponse({
    description: 'User with login ${dto.login} already exists',
  })
  @Post('signup')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo'))
  async signUp(
    @UploadedFile(new ParseFilePipe({}))
    photo: Express.Multer.File,
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refresh_token, access_token } = await this.authService.signUp({
      ...dto,
      photo,
    });
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
    });
    return new AccessDto(access_token);
  }

  @Post('signin')
  @ApiCreatedResponse({ type: AccessDto })
  @ApiForbiddenResponse({ description: 'Incorrect login or password' })
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refresh_token, access_token } = await this.authService.signIn(dto);
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
    });
    return new AccessDto(access_token);
  }

  @Post('refresh')
  @ApiCreatedResponse({ type: AccessDto })
  @ApiForbiddenResponse({ description: 'Incorrect refresh token' })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refresh_token } = request.cookies;
    const { access_token: new_access_token, refresh_token: new_refresh_token } =
      await this.authService.refresh({ refresh_token });
    response.cookie('refresh_token', new_refresh_token, {
      httpOnly: true,
    });
    return new AccessDto(new_access_token);
  }

  @Post('logout')
  @ApiCreatedResponse({ type: AccessDto })
  logout(
    @Res({ passthrough: true }) response: Response,
    @GetUser() userId: number,
  ) {
    response.cookie('refresh_token', '', {
      httpOnly: true,
    });
    return this.authService.logout(userId);
  }
}
