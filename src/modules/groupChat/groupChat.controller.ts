import { Controller, Param, Post, Body, Get, Query } from '@nestjs/common';
import {
  CreateGroupChatRequest,
  GetListGroupChatRequest,
  GetListMessageRequest,
  SendMessageRequest,
} from './dto/groupChat.request';
import { GroupChatService } from './groupChat.service';
import { ApiParam, ApiResponse } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { ObjectIdValidationPipe } from 'src/common/classValidation/objectIdValidationPipe';
import { Types } from 'mongoose';
import {
  CreateGroupChatResponse,
  GetListGroupChatResponse,
  GetListMessageResponse,
  SendMessageResponse,
} from './dto/groupChat.response';

@Controller('group-chats')
export class GroupChatController {
  constructor(private readonly groupChatService: GroupChatService) {}

  @ApiOperation({ summary: 'Create a group chat' })
  @ApiResponse({
    status: 200,
    description: 'The group chat has been successfully created.',
    type: CreateGroupChatResponse,
  })
  @Post()
  createGroupChat(
    @Body() request: CreateGroupChatRequest,
  ): Promise<CreateGroupChatResponse> {
    return this.groupChatService.createGroupChat(request);
  }

  @ApiOperation({ summary: 'Send a message to a group chat' })
  @ApiResponse({
    status: 200,
    description: 'The message has been successfully sent.',
    type: SendMessageResponse,
  })
  @ApiParam({ name: 'groupId', type: String })
  @Post(':groupId/messages')
  sendMessage(
    @Body() request: SendMessageRequest,
    @Param('groupId', ObjectIdValidationPipe) groupId: Types.ObjectId,
  ): Promise<SendMessageResponse> {
    return this.groupChatService.sendMessage(groupId, request);
  }

  @ApiOperation({ summary: 'Get all group chats' })
  @ApiResponse({
    status: 200,
    description: 'The group chats have been successfully retrieved.',
    type: GetListGroupChatResponse,
    isArray: true,
  })
  @Get('me')
  getMyList(
    @Query() request: GetListGroupChatRequest,
  ): Promise<GetListGroupChatResponse[]> {
    return this.groupChatService.getMyList(request);
  }

  @ApiOperation({ summary: 'Get a group chat by id' })
  @ApiResponse({
    status: 200,
    description: 'The group chat has been successfully retrieved.',
    type: GetListMessageResponse,
    isArray: true,
  })
  @ApiParam({ name: 'id', type: String })
  @Get(':groupId/messages')
  getMessages(
    @Param('groupId', ObjectIdValidationPipe) groupId: Types.ObjectId,
    @Query() request: GetListMessageRequest,
  ): Promise<GetListMessageResponse[]> {
    return this.groupChatService.getMessages(groupId, request);
  }
}
