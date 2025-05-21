import { Injectable } from '@nestjs/common';
import {
  CreateGroupChatRequest,
  GetListGroupChatRequest,
  GetListMessageRequest,
  SendMessageRequest,
} from './dto/groupChat.request';
import { GroupChatRepository } from 'src/database/groupChat/groupChat.repository';
import { Types } from 'mongoose';
import {
  CreateGroupChatResponse,
  GetListGroupChatResponse,
  GetListMessageResponse,
  SendMessageResponse,
} from './dto/groupChat.response';
import { GroupChat } from 'src/database/groupChat/groupChat.schema';
import { AsyncLocalStorage } from 'async_hooks';
import { UserContext } from 'src/common/asyncLocalStorage/userContext';
import { UserRepository } from 'src/database/user/user.repository';
import { BadRequestException } from 'src/common/exceptions/badRequest.exception';
import { ErrorConfig } from 'src/common/exceptions/errorConfig';
import { Message } from 'src/database/message/message.schema';
import { MessageRepository } from 'src/database/message/message.repository';
import { keyBy } from 'lodash';
import { EGroupChatType } from 'src/database/groupChat/groupChat.type';
@Injectable()
export class GroupChatService {
  constructor(
    private readonly groupChatRepository: GroupChatRepository,
    private readonly als: AsyncLocalStorage<UserContext>,
    private readonly userRepository: UserRepository,
    private readonly messageRepository: MessageRepository,
  ) {}

  /**
   * @method createGroupChat
   * @description This is a method for the group chat service to create a group chat
   */
  async createGroupChat(
    request: CreateGroupChatRequest,
  ): Promise<CreateGroupChatResponse> {
    // Get the user id from the async local storage
    const { userId } = this.als.getStore() as UserContext;
    // Check if the members are valid
    const members = await this.userRepository.findByIds(request.members);
    if (members.length !== request.members.length) {
      throw new BadRequestException(ErrorConfig.MEMBER_NOT_FOUND);
    }
    // Add the user id to the members
    request.members.push(userId);
    // Check if the number of members is valid
    if (
      (request.type === EGroupChatType.PERSONAL &&
        request.members.length !== 2) ||
      (request.type === EGroupChatType.GROUP && request.members.length < 3)
    ) {
      throw new BadRequestException(ErrorConfig.INVALID_MEMBER_NUMBER);
    }
    // Set the name of the group chat
    if (request.type === EGroupChatType.PERSONAL) {
      request.name = members[0].username;
    }
    // Create the group chat
    const groupChat = new GroupChat(userId, request);
    const createdGroupChat =
      await this.groupChatRepository.model.create(groupChat);
    return { id: createdGroupChat.id };
  }

  /**
   * @method sendMessage
   * @description This is a method for the group chat service to send a message
   */
  async sendMessage(
    groupId: Types.ObjectId,
    request: SendMessageRequest,
  ): Promise<SendMessageResponse> {
    // Get the user id from the async local storage
    const { userId } = this.als.getStore() as UserContext;
    // Check if the group chat exists
    const groupChat = await this.groupChatRepository.getById(groupId);
    if (!groupChat) {
      throw new BadRequestException(ErrorConfig.GROUP_CHAT_NOT_FOUND);
    }
    // Create the message
    const message = new Message(userId, groupId, request);
    const createdMessage = await this.messageRepository.model.create(message);
    return { id: createdMessage.id };
  }

  /**
   * @method getMyList
   * @description This is a method for the group chat service to get the list of group chats
   */
  async getMyList(
    request: GetListGroupChatRequest,
  ): Promise<GetListGroupChatResponse[]> {
    const { userId } = this.als.getStore() as UserContext;
    const groupChats = await this.groupChatRepository.getMyList(
      userId,
      request,
    );
    return groupChats.map((groupChat) =>
      groupChat.toGetListGroupChatResponse(),
    );
  }

  /**
   * @method getMessages
   * @description This is a method for the group chat service to get the list of messages
   */
  async getMessages(
    groupId: Types.ObjectId,
    request: GetListMessageRequest,
  ): Promise<GetListMessageResponse[]> {
    // Check if the group chat exists
    const groupChat = await this.groupChatRepository.getById(groupId);
    if (!groupChat) {
      throw new BadRequestException(ErrorConfig.GROUP_CHAT_NOT_FOUND);
    }
    // Get the list of messages
    const messages = await this.messageRepository.getList(groupId, request);

    // Get the list of users
    const userIds = messages.map(
      (message) => new Types.ObjectId(message.createdBy),
    );
    const users = await this.userRepository.findByIds(userIds);
    const userMap = keyBy(users, 'id');

    return messages.map((message) => {
      const user = userMap[message.createdBy];
      return message.toGetListMessageResponse(user);
    });
  }
}
