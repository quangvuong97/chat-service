import { AsyncLocalStorage } from 'async_hooks';

import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage(),
    },
  ],
  exports: [AsyncLocalStorage],
})
export class AsyncLocalStorageModule {}
