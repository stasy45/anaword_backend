import { Response } from 'express';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';



@Catch(HttpException)
export class ErrorBoundaryFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Определяем, является ли это ошибкой валидации (400 + объект без "message")
    if (status === HttpStatus.BAD_REQUEST) {
      // Проверяем, что тело — это объект с полями (ошибки валидации)
      if (
        exceptionResponse &&
        typeof exceptionResponse === 'object' &&
        !Array.isArray(exceptionResponse) &&
        !(exceptionResponse as any).message // не содержит общего message
      ) {
        // Это ошибка валидации — отправляем как есть
        response.status(status).json(exceptionResponse);
        return;
      }
    }

    // Любая другая ошибка → { message: ... }
    let message = 'Something went wrong';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      exceptionResponse &&
      typeof exceptionResponse === 'object' &&
      (exceptionResponse as any).message
    ) {
      const msg = (exceptionResponse as any).message;
      if (Array.isArray(msg)) {
        message = msg[0] || message;
      } else {
        message = msg;
      }
    }

    response.status(status).json({ message });
  }
}