import { Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

import { BadRequestException } from '../exceptions/badRequest.exception';
import { ErrorConfig } from '../exceptions/errorConfig';

/**
 * @class ObjectIdValidationPipe
 * @description Pipe custom to validate and transform string to MongoDB ObjectId.
 * Used in controller parameters to ensure the validity of the ID.
 * Throws BadRequestException when the value is not a valid ObjectId.
 *
 * Usage example:
 * ```typescript
 * @Get(':id')
 * findOne(@Param('id', ObjectIdValidationPipe) id: Types.ObjectId) {
 *   return this.service.findOne(id);
 * }
 * ```
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
