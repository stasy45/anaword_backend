import { APP_PORT } from 'env';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ErrorBoundaryFilter } from './utils/error-boundary.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const result: Record<string, string> = {};
        for (const error of errors) {
          const constraints = error.constraints;
          if (constraints) {
            const [firstConstraint] = Object.values(constraints);
            result[error.property] = firstConstraint;
          }
        }
        return new BadRequestException(result);
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new ErrorBoundaryFilter());
  app.use(cookieParser());
  app.use(express.json({ strict: false }));
  await app.listen(APP_PORT);
}

bootstrap();
