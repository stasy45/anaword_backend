import { PipeTransform } from '@nestjs/common';
export declare class NullableIntPipe implements PipeTransform<string, number | null> {
    transform(value: string): number | null;
}
