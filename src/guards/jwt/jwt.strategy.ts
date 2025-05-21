import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EEnvConfig } from 'src/common/constants';
import { JwtPayload } from './jwt.type';

/**
 * @Injectable()
 * @description This is a class for the jwt strategy
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * @constructor
   * @description This is a constructor for the jwt strategy
   */
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(EEnvConfig.JWT_SECRET) as string,
    });
  }

  /**
   * @method validate
   * @description This is a method for the jwt strategy to validate
   */
  async validate(payload: JwtPayload) {
    return payload;
  }
}
