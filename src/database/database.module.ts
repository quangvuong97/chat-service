import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EEnvConfig } from 'src/common/constants';

import { MongooseCustomModule } from './mongooseCustom.module';
import { UserRepository } from './user/user.repository';
import { GroupChatRepository } from './groupChat/groupChat.repository';
import { MessageRepository } from './message/message.repository';

/**
 * @module DatabaseModule
 * @description This is a module for the database
 */
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get(EEnvConfig.MONGODB_URI),
        dbName: 'chat_data',
      }),
    }),
    MongooseCustomModule.forCustomRepository([
      UserRepository,
      GroupChatRepository,
      MessageRepository,
    ]),
  ],
})
export class DatabaseModule {}
