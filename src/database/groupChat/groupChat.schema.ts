import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseEntity } from '../base.schema';
import { EGroupChatType } from './groupChat.type';
import { CreateGroupChatRequest } from 'src/modules/groupChat/dto/groupChat.request';
import { GetListGroupChatResponse } from 'src/modules/groupChat/dto/groupChat.response';
import { TransformUtils } from 'src/common/utils/transform.utils';

/**
 * @Schema GroupChat
 * @description This is a schema for the group chat
 */
@Schema({ collection: 'groupChats' })
export class GroupChat extends BaseEntity {
  constructor(userId: Types.ObjectId, request: CreateGroupChatRequest) {
    super();
    this.initBase(userId);
    this.name = request.name!;
    this.members = request.members;
    this.type = request.type;
  }
  /**
   * @property name
   * @description This is a property for the name
   */
  @Prop({ type: String })
  name: string;

  /**
   * @property members
   * @description This is a property for the members
   */
  @Prop({ type: [Types.ObjectId], ref: 'User' })
  members: Types.ObjectId[];

  /**
   * @property type
   * @description This is a property for the type
   */
  @Prop({ type: Number, enum: EGroupChatType })
  type: EGroupChatType;

  toGetListGroupChatResponse(): GetListGroupChatResponse {
    return {
      id: this.id,
      name: this.name,
      type: TransformUtils.enumToString(EGroupChatType, this.type),
    };
  }
}
