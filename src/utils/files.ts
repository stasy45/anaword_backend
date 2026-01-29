import { extname } from 'path';
import { mkdirSync } from 'fs';
import { existsSync } from 'fs';
import { HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { unlink } from 'fs/promises';

// Генерация уникального имени
export const generateFileName = (originalName: string): string => {
  const randomName = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  const ext = extname(originalName).toLowerCase();
  return `${randomName}${ext}`;
};

// Фильтр изображений
export const imageFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
    return callback(
      new HttpException('Разрешены только изображения (jpg, jpeg, png, gif)', HttpStatus.BAD_REQUEST),
      false,
    );
  }
  callback(null, true);
};

// Убедиться, что директория существует (рекурсивно)
export const ensureDirExists = (dir: string): void => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
};


export const removeFile = async (filePath: string): Promise<void> => {
  if (!existsSync(filePath)) {
    return;
  }

  try {
    await unlink(filePath);
  } catch (error) {
    throw new InternalServerErrorException(`Не удалось удалить файл`);
  }
};