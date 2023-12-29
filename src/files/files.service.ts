import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File } from './schemas/file.schema';
import { Model } from 'mongoose';
import { FileDto, UpdateFileDto, CreateFileDto } from './dto';
import { join } from 'path';
import fs from 'fs';
import { Types } from 'mongoose';
import { Express } from 'express';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<File>,
  ) {}

  async create(file: Express.Multer.File, dto: CreateFileDto) {
    const createdFile = await this.fileModel.create({
      filename: file.filename,
      originalname: dto.originalname || file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    });
    return new FileDto(createdFile);
  }

  async findAll() {
    const files = await this.fileModel.find().exec();
    return files.map((file) => new FileDto(file));
  }

  async findOne(id: Types.ObjectId) {
    const file = await this.fileModel.findById(id).exec();
    return new FileDto(file);
  }

  async remove(id: Types.ObjectId) {
    const file = await this.fileModel.findById(id).exec();
    fs.unlinkSync(join(__dirname, '..', '..', 'uploads-files', file.filename));
    await file.deleteOne();
    return new FileDto(file);
  }

  async update(id: Types.ObjectId, dto: UpdateFileDto) {
    const file = await this.fileModel.findById(id);
    await file.updateOne(dto);
    return new FileDto(file);
  }
}
