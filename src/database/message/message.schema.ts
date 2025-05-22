import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseEntity } from '../base.schema';
import { SendMessageRequest } from 'src/modules/groupChat/dto/groupChat.request';
import { GetListMessageResponse } from 'src/modules/groupChat/dto/groupChat.response';

/**
 * @Schema GroupChat
 * @description This is a schema for the group chat
 */
@Schema({ collection: 'messages' })
export class Message extends BaseEntity {
  constructor(
    userId: Types.ObjectId,
    groupId: Types.ObjectId,
    request: SendMessageRequest,
  ) {
    super();
    this.initBase(userId);
    this.groupId = groupId;
    this.content = request.content;
  }

  /**
   * @property groupId
   * @description This is a property for the group id
   */
  @Prop({ type: Types.ObjectId, ref: 'GroupChat' })
  groupId: Types.ObjectId;

  /**
   * @property content
   * @description This is a property for the content
   */
  @Prop({ type: String })
  content: string;

  /**
   * @property isRead
   * @description This is a property for the is read
   */
  @Prop({ type: Boolean, default: false })
  isRead: boolean;

  /**
   * @method toGetListMessageResponse
   * @description This is a method for the message to get the list of messages
   * @returns GetListMessageResponse
   */
  toGetListMessageResponse(user: {
    id: string;
    username: string;
  }): GetListMessageResponse {
    return {
      id: this.id,
      content: this.content,
      isRead: this.isRead,
      userId: user.id,
      username: user.username,
      createdAt: this.createdAt,
    };
  }
}
