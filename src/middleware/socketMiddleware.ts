import { Logger } from '@nestjs/common';
import { ExtendedError, Socket } from 'socket.io';
import { EEnvConfig } from 'src/common/constants';
import { JwtPayload } from 'src/guards/jwt/jwt.type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export async function handleSocketConnection(
  socket: Socket,
  next: (err?: ExtendedError) => void,
  jwtService: JwtService,
  configService: ConfigService,
) {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      throw new Error('Token not found');
    }
    const payload = await jwtService.verifyAsync<JwtPayload>(token, {
      secret: configService.get(EEnvConfig.JWT_SECRET),
    });
    socket.data.user = payload;
    next();
  } catch (error) {
    Logger.error(`${error.message}`);
    next(error);
  }
}
