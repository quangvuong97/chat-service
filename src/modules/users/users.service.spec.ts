import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from 'src/database/user/user.repository';
import { AsyncLocalStorage } from 'async_hooks';
import { UserContext } from 'src/common/asyncLocalStorage/userContext';
import { BadRequestException } from 'src/common/exceptions/badRequest.exception';
import { Types } from 'mongoose';
import { User } from 'src/database/user/user.schema';
import { GetFriendsRequest } from './dto/user.request';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    findById: jest.fn(),
    getFriends: jest.fn(),
  };

  const mockAsyncLocalStorage = {
    getStore: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: AsyncLocalStorage,
          useValue: mockAsyncLocalStorage,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should throw BadRequestException if user not found', async () => {
      // Arrange
      const userId = new Types.ObjectId();
      const userContext: UserContext = { userId, username: 'testuser' };

      mockAsyncLocalStorage.getStore.mockReturnValue(userContext);
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getProfile()).rejects.toThrow(BadRequestException);
      expect(mockAsyncLocalStorage.getStore).toHaveBeenCalled();
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should return user profile data when user exists', async () => {
      // Arrange
      const userId = new Types.ObjectId();
      const userContext: UserContext = { userId, username: 'testuser' };

      const user = new User('testuser', 'password123');
      user.id = userId.toString();

      mockAsyncLocalStorage.getStore.mockReturnValue(userContext);
      mockUserRepository.findById.mockResolvedValue(user);

      // Act
      const result = await service.getProfile();

      // Assert
      expect(mockAsyncLocalStorage.getStore).toHaveBeenCalled();
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        userId: user.id,
        username: user.username,
      });
    });
  });

  describe('getFriends', () => {
    it('should call userRepository.getFriends with correct parameters', async () => {
      // Arrange
      const userId = new Types.ObjectId();
      const userContext: UserContext = { userId, username: 'testuser' };

      const request: GetFriendsRequest = {
        keyword: 'test',
        page: 1,
        size: 10,
      };

      const mockFriends = [
        {
          toGetFriendResponse: () => ({
            userId: 'friend-id-1',
            username: 'friend1',
          }),
        },
        {
          toGetFriendResponse: () => ({
            userId: 'friend-id-2',
            username: 'friend2',
          }),
        },
      ];

      mockAsyncLocalStorage.getStore.mockReturnValue(userContext);
      mockUserRepository.getFriends.mockResolvedValue(mockFriends);

      // Act
      const result = await service.getFriends(request);

      // Assert
      expect(mockAsyncLocalStorage.getStore).toHaveBeenCalled();
      expect(mockUserRepository.getFriends).toHaveBeenCalledWith(
        userId,
        request,
      );
      expect(result).toEqual([
        {
          userId: 'friend-id-1',
          username: 'friend1',
        },
        {
          userId: 'friend-id-2',
          username: 'friend2',
        },
      ]);
    });

    it('should handle empty friend list', async () => {
      // Arrange
      const userId = new Types.ObjectId();
      const userContext: UserContext = { userId, username: 'testuser' };

      const request: GetFriendsRequest = {
        page: 1,
        size: 10,
      };

      mockAsyncLocalStorage.getStore.mockReturnValue(userContext);
      mockUserRepository.getFriends.mockResolvedValue([]);

      // Act
      const result = await service.getFriends(request);

      // Assert
      expect(mockAsyncLocalStorage.getStore).toHaveBeenCalled();
      expect(mockUserRepository.getFriends).toHaveBeenCalledWith(
        userId,
        request,
      );
      expect(result).toEqual([]);
    });
  });
});
