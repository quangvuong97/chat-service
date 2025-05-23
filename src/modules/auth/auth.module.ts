import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EEnvConfig } from 'src/common/constants';

/**
 * @Module
 * @description Module handles user authentication functionalities.
 * Configures JwtModule to create and verify tokens with an expiration time of 1 hour.
 * Exports JwtModule to allow other modules to use JWT functionalities.
 */
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(EEnvConfig.JWT_SECRET),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
