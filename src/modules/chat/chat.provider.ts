import { Injectable, Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Server, Socket } from 'socket.io';
import { ErrorConfig } from 'src/common/exceptions/errorConfig';
import { JwtWsGuard } from 'src/guards/jwt/jwt.ws.guard';
import { GroupChatConnectRequest } from './dto/chat.request';
import { GroupChatRepository } from 'src/database/groupChat/groupChat.repository';
import { GetListMessageResponse } from '../groupChat/dto/groupChat.response';

/**
 * @class ChatSocketProvider
 * @description Provider handles WebSocket connections for chat functionality.
 */
@UseGuards(JwtWsGuard)
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

  constructor(private readonly groupChatRepository: GroupChatRepository) {}

  /**
   * @method handleConnection
   * @description Handles client connection to WebSocket.
   */
  async handleConnection(client: Socket) {
    try {
      // validate request
      const request = plainToClass(
        GroupChatConnectRequest,
        client.handshake.query,
        {
          excludeExtraneousValues: true,
        },
      );
      const errors = await validate(request);
      if (errors.length > 0) {
        this.rejectConnection(client, errors);
        return;
      }

      // get group chat and check if it exists
      const groupChat = await this.groupChatRepository.getById(request.groupId);
      if (!groupChat) {
        this.rejectConnection(client, ErrorConfig.GROUP_CHAT_NOT_FOUND);
        return;
      }

      // join room corresponding to the group chat
      const room = `${this.PREFIX_GROUP_CHAT_ROOM}${groupChat._id}`;
      await client.join(room);
      Logger.log(
        `client ${client.handshake.headers.origin} with id ${client.id} is connecting on room ${room}`,
      );
    } catch (error) {
      Logger.error(error);
      this.rejectConnection(client, error.message);
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
    groupId: string,
    messageResponse: GetListMessageResponse,
    socketId: string,
  ) {
    Logger.log(
      `emit event new_message to room ${this.PREFIX_GROUP_CHAT_ROOM}${groupId}`,
    );
    return this.server
      .to(`${this.PREFIX_GROUP_CHAT_ROOM}${groupId}`)
      .except(socketId)
      .emit('new_message', messageResponse);
  }
}
