import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { ensureDirExists, generateFileName, imageFileFilter } from 'src/utils/files';

/**
 * Динамический интерцептор для загрузки изображения с путём вида:
 * ../images/:userId/:projectId/filename.ext
 *
 * @param fieldName — имя поля в FormData
 * @param getDestination — функция, возвращающая [userId, projectId] из запроса
 */
export const ImageContextFileInterceptor = (
  fieldName: string,
  getDestination: (req: Request) => string,
) =>
  FileInterceptor(fieldName, {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const path = getDestination(req);
        const uploadPath = join(process.cwd(), path); 
        ensureDirExists(uploadPath);
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        cb(null, generateFileName(file.originalname));
      },
    }),
    fileFilter: imageFileFilter,
  });