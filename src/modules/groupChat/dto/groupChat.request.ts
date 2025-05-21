import { IsArray, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsObjectId } from 'src/common/classValidation/isObjectId';
import { Types } from 'mongoose';
import { EGroupChatType } from 'src/database/groupChat/groupChat.type';
import { IsEnumValue } from 'src/common/classValidation/isEnumValue';
import { PagingFilterRequest } from 'src/common/pagingFilter.request';
/**
 * @class CreateGroupChatRequest
 * @description This is a class for the create group chat request
 */
export class CreateGroupChatRequest {
  /**
   * @property name
   * @description This is a property for the name of the group chat
   */
  @ApiPropertyOptional({
    description: 'Name of the group chat',
    example: 'Group Chat',
  })
  @ValidateIf((_, value) => value === EGroupChatType.GROUP)
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  name?: string;

  /**
   * @property Members
   * @description This is a property for the members of the group chat
   */
  @ApiProperty({
    description: 'Members of the group chat',
    example: ['664716471647164716471647'],
  })
  @IsNotEmpty()
  @IsArray()
  @IsObjectId({ each: true })
  members: Types.ObjectId[];

  /**
   * @property type
   * @description This is a property for the type of the group chat
   */
  @ApiProperty({
    enum: EGroupChatType,
    description: 'Type of the group chat',
    example: EGroupChatType.GROUP,
  })
  @IsEnumValue(EGroupChatType)
  @IsNotEmpty()
  type: EGroupChatType;
}

/**
 * @class SendMessageRequest
 * @description This is a class for the send message request
 */
export class SendMessageRequest {
  /**
   * @property content
   * @description This is a property for the content of the message
   */
  @ApiProperty({
    description: 'Content of the message',
    example: 'Hello, world!',
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  content: string;
}

/**
 * @class GetListGroupChatRequest
 * @description This is a class for the get list group chat request
 */
export class GetListGroupChatRequest extends PagingFilterRequest {}

/**
 * @class GetListMessageRequest
 * @description This is a class for the get list message request
 */
export class GetListMessageRequest extends PagingFilterRequest {}
