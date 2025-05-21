import { Types } from 'mongoose';
import { JwtPayload } from 'src/guards/jwt/jwt.type';

/**
 * @class UserContext
 * @description This is a class for the user context
 */
export class UserContext {
  userId: Types.ObjectId;
  username: string;

  /**
   * @constructor
   * @description This is a constructor for the user context
   */
  constructor(jwtPayload: JwtPayload) {
    if (jwtPayload) {
      this.userId = new Types.ObjectId(jwtPayload.userId);
      this.username = jwtPayload.username;
    }
  }
}
