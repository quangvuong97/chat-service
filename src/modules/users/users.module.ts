import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AsyncLocalStorageModule } from 'src/common/asyncLocalStorage/asyncLocalStorage.module';

@Module({
  imports: [AsyncLocalStorageModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
