import { Module } from '@nestjs/common';
import { GroupChatService } from './groupChat.service';
import { GroupChatController } from './groupChat.controller';
import { AsyncLocalStorageModule } from 'src/common/asyncLocalStorage/asyncLocalStorage.module';
import { ChatModule } from '../chat/chat.module';

/**
 * @Module
 * @description Module handles group chat functionalities.
 */
@Module({
  imports: [AsyncLocalStorageModule, ChatModule],
  controllers: [GroupChatController],
  providers: [GroupChatService],
})
export class GroupChatModule {}
