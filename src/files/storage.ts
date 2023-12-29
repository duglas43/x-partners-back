import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

const normalizeFileName = (req, file, callback) => {
  const fileExtName = file.originalname.split('.').pop();
  callback(null, `${uuid()}.${fileExtName}`);
};

export const fileStorage = diskStorage({
  destination: './uploads-files',
  filename: normalizeFileName,
});
