import { Module } from '@nestjs/common';
import { GroupChatService } from './groupChat.service';
import { GroupChatController } from './groupChat.controller';
import { AsyncLocalStorageModule } from 'src/common/asyncLocalStorage/asyncLocalStorage.module';

@Module({
  imports: [AsyncLocalStorageModule],
  controllers: [GroupChatController],
  providers: [GroupChatService],
})
export class GroupChatModule {}
