import { Prop, Schema } from '@nestjs/mongoose';
import { BaseEntity } from '../base.schema';
import { GetFriendResponse } from 'src/modules/users/dto/user.response';

/**
 * @Schema User
 * @description This is a schema for the user
 */
@Schema({ collection: 'users' })
export class User extends BaseEntity {
  /**
   * @constructor
   * @description This is a constructor for the user
   */
  constructor(username: string, password: string) {
    super();
    this.username = username;
    this.password = password;
  }

  /**
   * @property username
   * @description This is a property for the username
   */
  @Prop({ type: String })
  username: string;

  /**
   * @property password
   * @description This is a property for the password
   */
  @Prop({ type: String })
  password: string;

  /**
   * @method toGetFriendResponse
   * @description This is a method for the user to get the friend response
   */
  toGetFriendResponse(): GetFriendResponse {
    return {
      userId: this.id,
      username: this.username,
    };
  }
}
