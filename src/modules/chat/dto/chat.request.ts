import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { IsObjectId } from 'src/common/classValidation/isObjectId';
import { Types } from 'mongoose';

/**
 * @class GroupChatConnectRequest
 * @description DTO (Data Transfer Object) cho yêu cầu kết nối WebSocket đến một nhóm chat.
 */
export class GroupChatConnectRequest {
  @Expose()
  @IsNotEmpty()
  @IsObjectId()
  groupId: Types.ObjectId;
}
