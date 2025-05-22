import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
export class CreateGroupChatResponse {
  @ApiProperty({
    type: Types.ObjectId,
    description: 'The id of the group chat',
  })
  id: Types.ObjectId;
}

export class SendMessageResponse {
  @ApiProperty({
    type: Types.ObjectId,
    description: 'The id of the message',
  })
  id: Types.ObjectId;
}

export class GetListGroupChatResponse {
  @ApiProperty({
    type: String,
    description: 'The id of the group chat',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'The name of the group chat',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'The type of the group chat',
  })
  type: string;
}

export class GetListMessageResponse {
  @ApiProperty({
    type: String,
    description: 'The id of the message',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'The content of the message',
  })
  content: string;

  @ApiProperty({
    type: String,
    description: 'The id of the user',
  })
  userId: string;

  @ApiProperty({
    type: String,
    description: 'The username of the user',
  })
  username: string;

  @ApiProperty({
    type: Date,
    description: 'The created at of the message',
  })
  createdAt: Date;

  @ApiProperty({
    type: Boolean,
    description: 'The is read of the message',
  })
  isRead: boolean;
}
