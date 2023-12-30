import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParseMongoIdPipe } from '../types';
import { Types } from 'mongoose';
import { UsersService } from './users.service';
import { UpdateUserDto, UserDto } from './dto/';
import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { CustomApiNotFoundResponse } from 'src/types';
import { CustomApiForbiddenResponse } from 'src/types';

@CustomApiForbiddenResponse()
@CustomApiNotFoundResponse()
@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ type: [UserDto] })
  findAll(): Promise<UserDto[]> {
    return this.usersService.findAll();
  }

  @Get('me')
  @ApiOkResponse({ type: UserDto })
  findMe(@GetUser() user: UserDto) {
    return new UserDto(user);
  }

  @Get('/except-me')
  @ApiOkResponse({ type: [UserDto] })
  findAllExceptMe(@GetUser() user: UserDto) {
    return this.usersService.findAllExceptMe(user);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: UserDto })
  findOne(@Param('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: UserDto })
  update(
    @Param('id', ParseMongoIdPipe) id: Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: UserDto })
  remove(@Param('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.usersService.remove(id);
  }
}
