import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import { JwtAuthGuard } from './guards/jwt/jwt.guard';
import { JwtStrategy } from './guards/jwt/jwt.strategy';
import { GroupChatModule } from './modules/groupChat/groupChat.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', `.env.${process.env.NODE_ENV || 'development'}`],
      isGlobal: true,
    }),
    AuthModule,
    DatabaseModule,
    UsersModule,
    GroupChatModule,
    ChatModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
