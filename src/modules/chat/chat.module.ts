import { Module } from '@nestjs/common';
import { AsyncLocalStorageModule } from 'src/common/asyncLocalStorage/asyncLocalStorage.module';
import { ChatSocketProvider } from './chat.provider';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AsyncLocalStorageModule, AuthModule],
  providers: [ChatSocketProvider],
  exports: [ChatSocketProvider],
})
export class ChatModule {}
