import { Injectable, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Server, Socket } from 'socket.io';
import { ErrorConfig } from 'src/common/exceptions/errorConfig';
import { GroupChatConnectRequest } from './dto/chat.request';
import { GroupChatRepository } from 'src/database/groupChat/groupChat.repository';
import { GetListMessageResponse } from '../groupChat/dto/groupChat.response';
import { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { handleSocketConnection } from 'src/middleware/socketMiddleware';
import { JwtPayload } from 'src/guards/jwt/jwt.type';
import { GroupChat } from 'src/database/groupChat/groupChat.schema';

/**
 * @class ChatSocketProvider
 * @description Provider handles WebSocket connections for chat functionality.
 */
@WebSocketGateway({ namespace: '/chat', cors: true })
@Injectable()
export class ChatSocketProvider
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  /**
   * @property PREFIX_GROUP_CHAT_ROOM
   * @description Prefix for the group chat room name.
   */
  private readonly PREFIX_GROUP_CHAT_ROOM = 'group_chat_room_';
  /**
   * @property PREFIX_USER_
   * @description Prefix for the user room name.
   */
  private readonly PREFIX_USER_ = 'user_';

  constructor(
    private readonly groupChatRepository: GroupChatRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    server.use(async (socket: Socket, next) => {
      return await handleSocketConnection(
        socket,
        next,
        this.jwtService,
        this.configService,
      );
    });
  }

  /**
   * @method handleConnection
   * @description Handles client connection to WebSocket.
   */
  handleConnection(client: Socket) {
    try {
      const user: JwtPayload = client.data.user;
      const room = `${this.PREFIX_USER_}${user.userId}`;
      client.join(room);
      Logger.log(
        `client ${client.handshake.headers.origin} with id ${client.id} is connecting on room ${room}`,
      );
    } catch (error) {
      Logger.log(error);
      this.rejectConnection(client, error.message);
    }
  }

  @SubscribeMessage('join_group')
  async handleJoinGroup(
    @MessageBody() data: GroupChatConnectRequest,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const user: JwtPayload = client.data.user;
      Logger.log(
        `User ${user.userId} attempting to join group ${data.groupId}`,
      );
      // validate request
      const request = plainToClass(GroupChatConnectRequest, data, {
        excludeExtraneousValues: true,
      });
      const errors = await validate(request);
      if (errors.length > 0) {
        return client.emit('error', { message: errors });
      }

      // get group chat and check if it exists
      const groupChat = await this.groupChatRepository.getById(request.groupId);
      if (!groupChat) {
        return client.emit('error', {
          message: ErrorConfig.GROUP_CHAT_NOT_FOUND,
        });
      }
      // check if user is a member of the group
      const isMember = groupChat.members.includes(
        new Types.ObjectId(user.userId),
      );
      if (!isMember) {
        return client.emit('error', { message: 'Not a member of this group' });
      }

      // join room
      const room = `${this.PREFIX_GROUP_CHAT_ROOM}${groupChat.id}`;
      client.join(room);
      Logger.log(`User ${user.userId} joined group ${data.groupId}`);
    } catch (error) {
      Logger.error(`Error joining group: ${error.message}`);
      client.emit('error', {
        message: 'Failed to join group: ' + error.message,
      });
    }
  }

  @SubscribeMessage('leave_group')
  handleLeaveGroup(
    @MessageBody() data: { groupId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const user: JwtPayload = client.data.user;
      const room = `${this.PREFIX_GROUP_CHAT_ROOM}${data.groupId}`;
      client.leave(room);
      Logger.log(`User ${user.userId} left group ${data.groupId}`);
    } catch (error) {
      Logger.error(`Error leaving group: ${error.message}`);
      client.emit('error', {
        message: 'Failed to leave group: ' + error.message,
      });
    }
  }

  /**
   * @method rejectConnection
   * @description Từ chối kết nối của client và ngắt kết nối.
   * Gửi thông báo lỗi đến client trước khi ngắt kết nối.
   * @param client - Đối tượng Socket của client cần từ chối
   * @param message - Thông báo lỗi để gửi đến client
   */
  private rejectConnection(client: Socket, message: unknown) {
    client.emit('error', { message });
    client.disconnect();
  }

  /**
   * @method handleDisconnect
   * @description Xử lý khi client ngắt kết nối khỏi WebSocket.
   * Ghi log thông tin về client đã ngắt kết nối.
   * @param client - Đối tượng Socket của client đã ngắt kết nối
   */
  handleDisconnect(client: Socket): void {
    Logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * @method sendMessage
   * @description Gửi tin nhắn mới đến tất cả client trong cùng phòng chat.
   * Loại trừ client gửi tin nhắn để tránh nhận lại tin nhắn của chính mình.
   * @param groupId - ID của nhóm chat
   * @param messageResponse - Dữ liệu tin nhắn cần gửi
   * @param socketId - ID của socket client gửi tin nhắn (để loại trừ)
   * @returns Kết quả của việc emit sự kiện
   */
  sendMessage(
    groupChat: GroupChat,
    messageResponse: GetListMessageResponse,
    socketId: string,
  ) {
    const room = `${this.PREFIX_GROUP_CHAT_ROOM}${groupChat.id}`;
    Logger.log(`emit event new_message to room ${room}`);
    this.server.to(room).except(socketId).emit('new_message', messageResponse);

    groupChat.members.forEach((member) => {
      const room = `${this.PREFIX_USER_}${member.toString()}`;
      if (room !== socketId) {
        this.server.to(room).emit('group_new_message', groupChat);
      }
    });
  }
}
