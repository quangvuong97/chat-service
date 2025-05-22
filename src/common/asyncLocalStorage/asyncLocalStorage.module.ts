import { AsyncLocalStorage } from 'async_hooks';

import { Module } from '@nestjs/common';

/**
 * @module AsyncLocalStorageModule
 * @description Module provides AsyncLocalStorage to store context per request.
 * Creates and exports a single instance of AsyncLocalStorage to be used throughout the application.
 * Allows storing and accessing current user information throughout the request lifecycle
 * without needing to pass parameters through multiple classes.
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
