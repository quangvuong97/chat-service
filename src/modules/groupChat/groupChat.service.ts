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
import { ChatSocketProvider } from '../chat/chat.provider';

/**
 * @class GroupChatService
 * @description Service handles group chat functionalities.
 */
@Injectable()
export class GroupChatService {
  constructor(
    private readonly groupChatRepository: GroupChatRepository,
    private readonly als: AsyncLocalStorage<UserContext>,
    private readonly userRepository: UserRepository,
    private readonly messageRepository: MessageRepository,
    private readonly chatSocketProvider: ChatSocketProvider,
  ) {}

  /**
   * @method createGroupChat
   * @description Create a new group chat in the system.
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
    // Check if the group chat is personal and already exists then return the group chat id
    if (request.type === EGroupChatType.PERSONAL) {
      const existingPersonalChat = await this.groupChatRepository.getByMembers(
        request.members,
      );
      if (existingPersonalChat) {
        return { id: existingPersonalChat.id };
      }
    }
    // Create the group chat
    const groupChat = new GroupChat(userId, request);
    // Create the group chat in the database
    const createdGroupChat =
      await this.groupChatRepository.model.create(groupChat);
    // Return the group chat id
    return { id: createdGroupChat.id };
  }

  /**
   * @method sendMessage
   * @description Send a new message in a group chat.
   */
  async sendMessage(
    groupId: Types.ObjectId,
    request: SendMessageRequest,
  ): Promise<SendMessageResponse> {
    // get current user from AsyncLocalStorage
    const { userId, username } = this.als.getStore() as UserContext;
    // Check if the group chat exists
    const groupChat = await this.groupChatRepository.getById(groupId);
    if (!groupChat) {
      throw new BadRequestException(ErrorConfig.GROUP_CHAT_NOT_FOUND);
    }
    // Create the message
    const message = new Message(userId, groupId, request);
    const createdMessage = await this.messageRepository.model.create(message);
    // Socket: Send the message to other clients in the group chat room
    this.chatSocketProvider.sendMessage(
      groupId.toString(),
      createdMessage.toGetListMessageResponse({
        username,
        id: userId.toString(),
      }),
      request.socketId,
    );
    // Return the message id
    return { id: createdMessage.id };
  }

  /**
   * @method getMyList
   * @description Get the list of group chats that the current user is participating in.
   */
  async getMyList(
    request: GetListGroupChatRequest,
  ): Promise<GetListGroupChatResponse[]> {
    // Get the user id from the async local storage
    const { userId } = this.als.getStore() as UserContext;
    // Get the list of group chats
    const groupChats = await this.groupChatRepository.getMyList(
      userId,
      request,
    );
    const memberIds = groupChats.flatMap((groupChat) =>
      groupChat.type === EGroupChatType.PERSONAL ? groupChat.members : [],
    );
    const members = await this.userRepository.findByIds(memberIds);
    const memberMap = keyBy(members, 'id');
    // Return the list of group chats
    return groupChats.map((groupChat) => {
      if (groupChat.type === EGroupChatType.PERSONAL) {
        const partnerMember = groupChat.members.filter(
          (member) => member.toString() !== userId.toString(),
        );
        groupChat.name = memberMap[partnerMember[0].toString()].username;
      }
      return groupChat.toGetListGroupChatResponse();
    });
  }

  /**
   * @method getMessages
   * @description Get the list of messages in a group chat.
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
    // Return the list of messages
    return messages.map((message) => {
      const user = userMap[message.createdBy];
      return message.toGetListMessageResponse(user);
    });
  }
}
