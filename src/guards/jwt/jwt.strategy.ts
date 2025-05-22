import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EEnvConfig } from 'src/common/constants';
import { JwtPayload } from './jwt.type';

/**
 * @Injectable()
 * @description Chiến lược JWT cho Passport.js, xử lý việc xác thực token JWT.
 * Lớp này định nghĩa cách trích xuất và xác thực JWT token từ request,
 * sử dụng để bảo vệ các endpoint yêu cầu xác thực.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(EEnvConfig.JWT_SECRET) as string,
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
