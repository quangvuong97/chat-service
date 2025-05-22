import { Prop, Schema } from '@nestjs/mongoose';
import { BaseEntity } from '../base.schema';
import { GetFriendResponse } from 'src/modules/users/dto/user.response';

/**
 * @Schema User
 * @description Schema defines the structure of the user data in MongoDB.
 * Stores basic user information such as username and hashed password.
 * Inherits from BaseEntity to have the basic fields like id, deleted, createdAt, updatedAt.
 */
@Schema({ collection: 'users' })
export class User extends BaseEntity {
  constructor(username: string, password: string) {
    super();
    this.username = username;
    this.password = password;
  }

  /**
   * @property username
   * @description The username of the user.
   * Used for authentication and display in the application.
   * Must be unique in the system.
   */
  @Prop({ type: String })
  username: string;

  /**
   * @property password
   * @description The hashed password of the user.
   * Stored using bcrypt for security.
   * Never stored or passed as plain text.
   */
  @Prop({ type: String })
  password: string;

  /**
   * @method toGetFriendResponse
   * @description Converts the User object to a response object for the API.
   * Returns only the public information of the user (userId, username),
   * removing sensitive information like password.
   * @returns The GetFriendResponse object containing the filtered user information
   */
  toGetFriendResponse(): GetFriendResponse {
    return {
      userId: this.id,
      username: this.username,
    };
  }
}
