import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ParseFilePipe,
} from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { FileDto, UpdateFileDto, CreateFileDto } from './dto';
import { fileStorage } from './storage';
import { UploadedFile } from '@nestjs/common';
import { Types } from 'mongoose';
import { ParseMongoIdPipe } from 'src/types';
import { Public } from 'src/auth/decorator/public.decorator';

@ApiBearerAuth()
@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Public()
  @Post()
  @ApiCreatedResponse({ type: FileDto })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileStorage,
      limits: {
        fileSize: 1024 * 1024 * 100,
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        originalname: {
          type: 'string',
        },
      },
    },
  })
  create(
    @UploadedFile(new ParseFilePipe({}))
    file: Express.Multer.File,
    @Body() createFileDto: CreateFileDto,
  ) {
    return this.filesService.create(file, createFileDto);
  }

  @Get()
  @ApiOkResponse({ type: [FileDto] })
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: FileDto })
  findOne(@Param('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.filesService.findOne(id);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: FileDto })
  remove(@Param('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.filesService.remove(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: FileDto })
  update(
    @Param('id', ParseMongoIdPipe) id: Types.ObjectId,
    @Body() updateFileDto: UpdateFileDto,
  ) {
    return this.filesService.update(id, updateFileDto);
  }
}
