import { Types } from 'mongoose';
import { JwtPayload } from 'src/guards/jwt/jwt.type';

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
