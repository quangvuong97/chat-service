import { Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

import { BadRequestException } from '../exceptions/badRequest.exception';
import { ErrorConfig } from '../exceptions/errorConfig';

/**
 * @class ObjectIdValidationPipe
 * @description This is a class for the object id validation pipe
 */
@Injectable()
export class ObjectIdValidationPipe implements PipeTransform<string> {
  transform(value: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(ErrorConfig.INVALID_OBJECT_ID);
    }
    return new Types.ObjectId(value);
  }
}
