import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { EEnvConfig } from 'src/common/constants';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from './jwt.type';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorator/public';

/**
 * @class JwtAuthGuard
 * @description Guard protects endpoints that require JWT authentication.
 * Checks and authenticates JWT token from the Authorization header of the request.
 * Allows endpoints marked as public to bypass authentication.
 * Used for HTTP requests.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the endpoint is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    // Extract the token from the header and check if it exists
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      // Verify the token and set the user context to the request
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get(EEnvConfig.JWT_SECRET),
      });
      // Set the user context to the request
      request.user = payload;
    } catch (error) {
      Logger.log(error);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // Extract the token from the header
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    // Return the token if it exists and is in the correct format
    return type === 'Bearer' ? token : undefined;
  }
}
