import { Test, TestingModule } from '@nestjs/testing';
import { GroupChatService } from './groupChat.service';
import { GroupChatRepository } from 'src/database/groupChat/groupChat.repository';
import { AsyncLocalStorage } from 'async_hooks';
import { UserRepository } from 'src/database/user/user.repository';
import { MessageRepository } from 'src/database/message/message.repository';
import { UserContext } from 'src/common/asyncLocalStorage/userContext';
import { Types } from 'mongoose';
import {
  CreateGroupChatRequest,
  GetListGroupChatRequest,
  GetListMessageRequest,
  SendMessageRequest,
} from './dto/groupChat.request';
import { BadRequestException } from 'src/common/exceptions/badRequest.exception';
import { EGroupChatType } from 'src/database/groupChat/groupChat.type';
import { ChatSocketProvider } from '../chat/chat.provider';

describe('GroupChatService', () => {
  let service: GroupChatService;

  // Tạo các mock dependencies
  const mockGroupChatRepository = {
    model: {
      create: jest.fn(),
    },
    getById: jest.fn(),
    getMyList: jest.fn(),
    getByMembers: jest.fn(), // Thêm mock function này
  };

  const mockAsyncLocalStorage = {
    getStore: jest.fn(),
  };

  const mockUserRepository = {
    findByIds: jest.fn(),
  };

  const mockMessageRepository = {
    model: {
      create: jest.fn(),
    },
    getList: jest.fn(),
  };

  const mockChatSocketProvider = {
    sendMessage: jest.fn(),
  };

  const userId = new Types.ObjectId();
  const mockUserContext: UserContext = { userId, username: 'testUser' };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockAsyncLocalStorage.getStore.mockReturnValue(mockUserContext);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupChatService,
        {
          provide: GroupChatRepository,
          useValue: mockGroupChatRepository,
        },
        {
          provide: AsyncLocalStorage,
          useValue: mockAsyncLocalStorage,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: MessageRepository,
          useValue: mockMessageRepository,
        },
        {
          provide: ChatSocketProvider,
          useValue: mockChatSocketProvider,
        },
      ],
    }).compile();

    service = module.get<GroupChatService>(GroupChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createGroupChat', () => {
    it('should create a personal chat successfully', async () => {
      // Arrange
      const memberId = new Types.ObjectId();
      const request: CreateGroupChatRequest = {
        type: EGroupChatType.PERSONAL,
        members: [memberId],
        name: '',
      };

      const mockUser = { id: memberId.toString(), username: 'testUser' };
      mockUserRepository.findByIds.mockResolvedValue([mockUser]);
      mockGroupChatRepository.getByMembers.mockResolvedValue(null);

      const createdId = new Types.ObjectId();
      mockGroupChatRepository.model.create.mockResolvedValue({ id: createdId });

      // Act
      const result = await service.createGroupChat(request);

      // Assert
      expect(mockAsyncLocalStorage.getStore).toHaveBeenCalled();
      expect(mockUserRepository.findByIds).toHaveBeenCalled();
      expect(mockGroupChatRepository.model.create).toHaveBeenCalledWith(
        expect.any(Object),
      );
      expect(request.members).toContain(userId);
      expect(result).toEqual({ id: createdId });
    });

    it('should return existing personal chat id if it already exists', async () => {
      // Arrange
      const memberId = new Types.ObjectId();
      const request: CreateGroupChatRequest = {
        type: EGroupChatType.PERSONAL,
        members: [memberId],
        name: '',
      };

      const mockUser = { id: memberId.toString(), username: 'testUser' };
      mockUserRepository.findByIds.mockResolvedValue([mockUser]);

      const existingChatId = new Types.ObjectId();
      mockGroupChatRepository.getByMembers.mockResolvedValue({
        id: existingChatId,
      });

      // Act
      const result = await service.createGroupChat(request);

      // Assert
      expect(mockAsyncLocalStorage.getStore).toHaveBeenCalled();
      expect(mockUserRepository.findByIds).toHaveBeenCalled();
      expect(mockGroupChatRepository.getByMembers).toHaveBeenCalledWith(
        expect.arrayContaining([userId, memberId]),
      );
      expect(mockGroupChatRepository.model.create).not.toHaveBeenCalled();
      expect(result).toEqual({ id: existingChatId });
    });

    it('should create a group chat successfully', async () => {
      // Arrange
      const memberIds = [new Types.ObjectId(), new Types.ObjectId()];
      const request: CreateGroupChatRequest = {
        type: EGroupChatType.GROUP,
        members: [...memberIds], // Sao chép mảng để tránh thay đổi trực tiếp
        name: 'Test Group',
      };

      const mockUsers = [
        { id: memberIds[0].toString(), username: 'member1' },
        { id: memberIds[1].toString(), username: 'member2' },
      ];
      mockUserRepository.findByIds.mockResolvedValue(mockUsers);

      const createdId = new Types.ObjectId();
      mockGroupChatRepository.model.create.mockResolvedValue({ id: createdId });

      // Act
      const result = await service.createGroupChat(request);

      // Assert
      expect(mockAsyncLocalStorage.getStore).toHaveBeenCalled();
      expect(mockUserRepository.findByIds).toHaveBeenCalled();
      expect(mockGroupChatRepository.model.create).toHaveBeenCalledWith(
        expect.any(Object),
      );
      expect(request.members).toContain(userId);
      expect(request.name).toBe('Test Group');
      expect(result).toEqual({ id: createdId });
    });

    it('should throw an error if members are not found', async () => {
      // Arrange
      const memberIds = [new Types.ObjectId()];
      const request: CreateGroupChatRequest = {
        type: EGroupChatType.PERSONAL,
        members: [...memberIds],
        name: '',
      };

      mockUserRepository.findByIds.mockResolvedValue([]);

      // Act & Assert
      await expect(service.createGroupChat(request)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockGroupChatRepository.model.create).not.toHaveBeenCalled();
    });

    it('should throw an error if personal chat has wrong number of members', async () => {
      // Arrange
      const memberIds = [new Types.ObjectId(), new Types.ObjectId()];
      const request: CreateGroupChatRequest = {
        type: EGroupChatType.PERSONAL,
        members: [...memberIds],
        name: '',
      };

      const mockUsers = [
        { id: memberIds[0].toString(), username: 'member1' },
        { id: memberIds[1].toString(), username: 'member2' },
      ];
      mockUserRepository.findByIds.mockResolvedValue(mockUsers);

      // Act & Assert
      await expect(service.createGroupChat(request)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockGroupChatRepository.model.create).not.toHaveBeenCalled();
    });

    it('should throw an error if group chat has less than 3 members', async () => {
      // Arrange
      const memberIds = [new Types.ObjectId()];
      const request: CreateGroupChatRequest = {
        type: EGroupChatType.GROUP,
        members: [...memberIds],
        name: 'Test Group',
      };

      const mockUsers = [{ id: memberIds[0].toString(), username: 'member1' }];
      mockUserRepository.findByIds.mockResolvedValue(mockUsers);

      // Act & Assert
      await expect(service.createGroupChat(request)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockGroupChatRepository.model.create).not.toHaveBeenCalled();
    });
  });

  describe('sendMessage', () => {
    it('should send a message successfully', async () => {
      // Arrange
      const groupId = new Types.ObjectId();
      const request: SendMessageRequest = {
        content: 'Test message',
        socketId: 'testSocketId',
      };

      mockGroupChatRepository.getById.mockResolvedValue({ id: groupId });

      const messageId = new Types.ObjectId();
      const mockMessage = {
        id: messageId,
        toGetListMessageResponse: jest.fn().mockReturnValue({ id: messageId }),
      };
      mockMessageRepository.model.create.mockResolvedValue(mockMessage);

      // Act
      const result = await service.sendMessage(groupId, request);

      // Assert
      expect(mockAsyncLocalStorage.getStore).toHaveBeenCalled();
      expect(mockGroupChatRepository.getById).toHaveBeenCalledWith(groupId);
      expect(mockMessageRepository.model.create).toHaveBeenCalledWith(
        expect.any(Object),
      );
      expect(mockChatSocketProvider.sendMessage).toHaveBeenCalled();
      expect(result).toEqual({ id: messageId });
    });

    it('should throw an error if group chat is not found', async () => {
      // Arrange
      const groupId = new Types.ObjectId();
      const request: SendMessageRequest = {
        content: 'Test message',
        socketId: 'testSocketId',
      };

      mockGroupChatRepository.getById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.sendMessage(groupId, request)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockMessageRepository.model.create).not.toHaveBeenCalled();
    });
  });

  describe('getMyList', () => {
    it('should return list of group chats', async () => {
      // Arrange
      const request: GetListGroupChatRequest = {
        page: 1,
        size: 10,
      };

      const mockGroupChats = [
        {
          toGetListGroupChatResponse: jest
            .fn()
            .mockReturnValue({ id: 'group1' }),
        },
        {
          toGetListGroupChatResponse: jest
            .fn()
            .mockReturnValue({ id: 'group2' }),
        },
      ];

      mockGroupChatRepository.getMyList.mockResolvedValue(mockGroupChats);

      // Act
      const result = await service.getMyList(request);

      // Assert
      expect(mockAsyncLocalStorage.getStore).toHaveBeenCalled();
      expect(mockGroupChatRepository.getMyList).toHaveBeenCalledWith(
        userId,
        request,
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 'group1' });
      expect(result[1]).toEqual({ id: 'group2' });
    });
  });

  describe('getMessages', () => {
    it('should return list of messages', async () => {
      // Arrange
      const groupId = new Types.ObjectId();
      const request: GetListMessageRequest = {
        page: 1,
        size: 10,
      };

      mockGroupChatRepository.getById.mockResolvedValue({ id: groupId });

      const mockUserIds = [new Types.ObjectId(), new Types.ObjectId()];
      const mockMessages = [
        {
          createdBy: mockUserIds[0],
          toGetListMessageResponse: jest
            .fn()
            .mockReturnValue({ id: 'message1' }),
        },
        {
          createdBy: mockUserIds[1],
          toGetListMessageResponse: jest
            .fn()
            .mockReturnValue({ id: 'message2' }),
        },
      ];

      mockMessageRepository.getList.mockResolvedValue(mockMessages);

      const mockUsers = [
        { id: mockUserIds[0].toString(), username: 'User 1' },
        { id: mockUserIds[1].toString(), username: 'User 2' },
      ];

      mockUserRepository.findByIds.mockResolvedValue(mockUsers);

      // Act
      const result = await service.getMessages(groupId, request);

      // Assert
      expect(mockGroupChatRepository.getById).toHaveBeenCalledWith(groupId);
      expect(mockMessageRepository.getList).toHaveBeenCalledWith(
        groupId,
        request,
      );
      expect(mockUserRepository.findByIds).toHaveBeenCalledWith(
        expect.arrayContaining([expect.any(Types.ObjectId)]),
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 'message1' });
      expect(result[1]).toEqual({ id: 'message2' });
    });

    it('should throw an error if group chat is not found', async () => {
      // Arrange
      const groupId = new Types.ObjectId();
      const request: GetListMessageRequest = {
        page: 1,
        size: 10,
      };

      mockGroupChatRepository.getById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getMessages(groupId, request)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockMessageRepository.getList).not.toHaveBeenCalled();
      expect(mockUserRepository.findByIds).not.toHaveBeenCalled();
    });
  });
});
