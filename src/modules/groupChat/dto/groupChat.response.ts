import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

/**
 * @class CreateGroupChatResponse
 * @description This is a class for the create group chat response
 */
export class CreateGroupChatResponse {
  /**
   * @property id
   * @description This is a property for the id of the group chat
   */
  @ApiProperty({
    type: Types.ObjectId,
    description: 'The id of the group chat',
  })
  id: Types.ObjectId;
}

/**
 * @class SendMessageResponse
 * @description This is a class for the send message response
 */
export class SendMessageResponse {
  /**
   * @property id
   * @description This is a property for the id of the message
   */
  @ApiProperty({
    type: Types.ObjectId,
    description: 'The id of the message',
  })
  id: Types.ObjectId;
}

/**
 * @class GetListGroupChatResponse
 * @description This is a class for the get list group chat response
 */
export class GetListGroupChatResponse {
  /**
   * @property id
   * @description This is a property for the id of the group chat
   */
  @ApiProperty({
    type: String,
    description: 'The id of the group chat',
  })
  id: string;

  /**
   * @property name
   * @description This is a property for the name of the group chat
   */
  @ApiProperty({
    type: String,
    description: 'The name of the group chat',
  })
  name: string;

  /**
   * @property type
   * @description This is a property for the type of the group chat
   */
  @ApiProperty({
    type: String,
    description: 'The type of the group chat',
  })
  type: string;
}

/**
 * @class GetListMessageResponse
 * @description This is a class for the get list message response
 */
export class GetListMessageResponse {
  /**
   * @property id
   * @description This is a property for the id of the message
   */
  @ApiProperty({
    type: String,
    description: 'The id of the message',
  })
  id: string;

  /**
   * @property content
   * @description This is a property for the content of the message
   */
  @ApiProperty({
    type: String,
    description: 'The content of the message',
  })
  content: string;

  /**
   * @property userId
   * @description This is a property for the user id of the message
   */
  @ApiProperty({
    type: String,
    description: 'The id of the user',
  })
  userId: string;

  /**
   * @property username
   * @description This is a property for the username of the user
   */
  @ApiProperty({
    type: String,
    description: 'The username of the user',
  })
  username: string;

  /**
   * @property createdAt
   * @description This is a property for the created at of the message
   */
  @ApiProperty({
    type: Date,
    description: 'The created at of the message',
  })
  createdAt: Date;

  /**
   * @property isRead
   * @description This is a property for the is read of the message
   */
  @ApiProperty({
    type: Boolean,
    description: 'The is read of the message',
  })
  isRead: boolean;
}
