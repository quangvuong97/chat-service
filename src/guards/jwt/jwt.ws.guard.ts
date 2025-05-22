// jwt-ws.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { EEnvConfig } from 'src/common/constants';

/**
 * @Injectable()
 * @description Guard protects WebSocket endpoints that require JWT authentication.
 * Checks and authenticates JWT token from the Authorization header of the request.
 * Allows endpoints marked as public to bypass authentication.
 * Used for WebSocket requests.
 */
@Injectable()
export class JwtWsGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('canActivate');
    const client: Socket = context.switchToWs().getClient();
    const token = client.handshake.auth?.token || client.handshake.query?.token;

    if (!token) throw new UnauthorizedException('Token not found');

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get(EEnvConfig.JWT_SECRET),
      });
      client.data.user = payload; // gán user cho socket để tái sử dụng
      return true;
    } catch (error) {
      Logger.log(error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
