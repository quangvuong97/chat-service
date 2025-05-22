import { Module } from '@nestjs/common';
import { ChatSocketProvider } from './chat.provider';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ChatSocketProvider],
  exports: [ChatSocketProvider],
})
export class ChatModule {}
