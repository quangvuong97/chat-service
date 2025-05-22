import { Types } from 'mongoose';
import { JwtPayload } from 'src/guards/jwt/jwt.type';

/**
 * @class UserContext
 * @description This class represents the current user context in the request processing.
 * It stores user information such as ID and username that has been authenticated
 * so that it can be accessed throughout the request lifecycle without needing to pass parameters through multiple classes.
 */
export class UserContext {
  userId: Types.ObjectId;
  username: string;

  constructor(jwtPayload: JwtPayload) {
    if (jwtPayload) {
      this.userId = new Types.ObjectId(jwtPayload.userId);
      this.username = jwtPayload.username;
    }
  }
}
