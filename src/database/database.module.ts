import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EEnvConfig } from 'src/common/constants';

import { MongooseCustomModule } from './mongooseCustom.module';
import { UserRepository } from './user/user.repository';

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
    MongooseCustomModule.forCustomRepository([UserRepository]),
  ],
})
export class DatabaseModule {}
