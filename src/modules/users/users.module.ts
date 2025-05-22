import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AsyncLocalStorageModule } from 'src/common/asyncLocalStorage/asyncLocalStorage.module';

/**
 * @Module
 * @description Module handles user functionalities.
 */
@Module({
  imports: [AsyncLocalStorageModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
