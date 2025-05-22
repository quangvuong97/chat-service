import { IsArray, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsObjectId } from 'src/common/classValidation/isObjectId';
import { Types } from 'mongoose';
import { EGroupChatType } from 'src/database/groupChat/groupChat.type';
import { IsEnumValue } from 'src/common/classValidation/isEnumValue';
import { PagingFilterRequest } from 'src/common/pagingFilter.request';

export class CreateGroupChatRequest {
  @ApiPropertyOptional({
    description: 'Name of the group chat',
    example: 'Group Chat',
  })
  @ValidateIf((_, value) => value === EGroupChatType.GROUP)
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  name?: string;

  @ApiProperty({
    description: 'Members of the group chat',
    example: ['664716471647164716471647'],
  })
  @IsNotEmpty()
  @IsArray()
  @IsObjectId({ each: true })
  members: Types.ObjectId[];

  @ApiProperty({
    enum: EGroupChatType,
    description: 'Type of the group chat',
    example: EGroupChatType.GROUP,
  })
  @IsEnumValue(EGroupChatType)
  @IsNotEmpty()
  type: EGroupChatType;
}

export class SendMessageRequest {
  @ApiProperty({
    description: 'Content of the message',
    example: 'Hello, world!',
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  content: string;

  @ApiProperty({
    description: 'Socket id of the message',
  })
  @IsNotEmpty()
  @IsString()
  socketId: string;
}

export class GetListGroupChatRequest extends PagingFilterRequest {}

export class GetListMessageRequest extends PagingFilterRequest {}
