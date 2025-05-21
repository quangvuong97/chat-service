import { SetMetadata } from '@nestjs/common';

export const MONGOOSE_EX_CUSTOM_REPOSITORY = 'MONGOOSE_EX_CUSTOM_REPOSITORY';

export function CustomMongooseRepository<T>(entity: T): ClassDecorator {
  return SetMetadata(MONGOOSE_EX_CUSTOM_REPOSITORY, entity);
}
