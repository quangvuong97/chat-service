import { applyDecorators, HttpStatus } from '@nestjs/common';
import { Transform, TransformFnParams } from 'class-transformer';
import { isArray } from 'class-validator';
import { Types } from 'mongoose';

import { BadRequestException } from '../exceptions/badRequest.exception';

/**
 * @decorator IsObjectId
 * @description This is a decorator for the object id validation
 */
export function IsObjectId(validationOptions?: { each?: boolean }) {
  return applyDecorators(
    Transform(({ value, key }: TransformFnParams) => {
      // Nếu value undefined hoặc null, bỏ qua validate (để @IsOptional hoạt động)
      if (value === undefined || value === null) {
        return value;
      }
      if (validationOptions?.each && typeof value === 'string')
        value = value.split(',');
      if (validationOptions?.each && isArray(value)) {
        return value.map((e: string) => {
          if (!Types.ObjectId.isValid(e))
            throw new BadRequestException(
              `each value in ${key} must be a objectId`,
              HttpStatus.BAD_REQUEST,
            );
          return new Types.ObjectId(e);
        });
      }
      if (typeof value !== 'string' || !Types.ObjectId.isValid(value)) {
        throw new BadRequestException(
          `${key} must be a objectId`,
          HttpStatus.BAD_REQUEST,
        );
      }
      return new Types.ObjectId(value as string);
    }),
  );
}
