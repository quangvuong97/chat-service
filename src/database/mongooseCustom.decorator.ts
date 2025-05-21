import { SetMetadata } from '@nestjs/common';

/**
 * @constant MONGOOSE_EX_CUSTOM_REPOSITORY
 * @description This is a constant for the mongoose ex custom repository
 */
export const MONGOOSE_EX_CUSTOM_REPOSITORY = 'MONGOOSE_EX_CUSTOM_REPOSITORY';

/**
 * @decorator CustomMongooseRepository
 * @description This is a decorator for the custom mongoose repository
 */
export function CustomMongooseRepository<T>(entity: T): ClassDecorator {
  return SetMetadata(MONGOOSE_EX_CUSTOM_REPOSITORY, entity);
}
