import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { FORM_VALIDATION } from 'src/env';



@Injectable()
export class NullableIntPipe implements PipeTransform<string, number | null> {
  transform(value: string): number | null {
    if (value === undefined || value === null || value === '' || value === 'null') {
      return null;
    }

    const num = Number(value);
    if (isNaN(num) || !Number.isInteger(num) || num <= 0) {
      throw new BadRequestException(FORM_VALIDATION.INT);
    }

    return num;
  }
}