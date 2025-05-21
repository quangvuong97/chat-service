import { AsyncLocalStorage } from 'async_hooks';

import { Module } from '@nestjs/common';

/**
 * @module AsyncLocalStorageModule
 * @description This is a module for the async local storage
 */
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
