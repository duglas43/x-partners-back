import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import multer, { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  private limits: MulterModuleOptions['limits'] = {
    fileSize: 1024 * 1024 * 5,
  };
  private normalizeFileName: multer.DiskStorageOptions['filename'] = (
    req,
    file,
    callback,
  ) => {
    const fileExtName = file.originalname.split('.').pop();
    callback(null, `${uuid()}.${fileExtName}`);
  };

  private fileFilter: MulterModuleOptions['fileFilter'] = (
    req,
    file,
    callback,
  ) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      callback(null, true);
    } else {
      callback(new UnsupportedMediaTypeException(), false);
    }
  };
  private readonly fileStorage: MulterModuleOptions['storage'] = diskStorage({
    destination: './uploads-files',
    filename: this.normalizeFileName,
  });

  createMulterOptions(): MulterModuleOptions {
    return {
      dest: './upload',
      storage: this.fileStorage,
      fileFilter: this.fileFilter,
      limits: this.limits,
    };
  }
}
