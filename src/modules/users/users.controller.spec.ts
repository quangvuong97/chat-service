import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GetFriendResponse, GetProfileResponse } from './dto/user.response';
import { GetFriendsRequest } from './dto/user.request';
import { validate } from 'class-validator';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    getProfile: jest.fn(),
    getFriends: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should call usersService.getProfile and return user profile data', async () => {
      // Arrange
      const profileResponse: GetProfileResponse = {
        userId: 'user-id',
        username: 'testuser',
      };
      mockUsersService.getProfile.mockResolvedValue(profileResponse);

      // Act
      const result = await controller.getProfile();

      // Assert
      expect(usersService.getProfile).toHaveBeenCalled();
      expect(result).toEqual(profileResponse);
    });
  });

  describe('getFriends', () => {
    it('should call usersService.getFriends with correct parameters', async () => {
      // Arrange
      const request: GetFriendsRequest = {
        keyword: 'test',
        page: 1,
        size: 10,
      };

      const friendsResponse: GetFriendResponse[] = [
        {
          userId: 'friend-id-1',
          username: 'friend1',
        },
        {
          userId: 'friend-id-2',
          username: 'friend2',
        },
      ];

      mockUsersService.getFriends.mockResolvedValue(friendsResponse);

      // Act
      const result = await controller.getFriends(request);

      // Assert
      expect(usersService.getFriends).toHaveBeenCalledWith(request);
      expect(result).toEqual(friendsResponse);
    });

    it('should handle empty friend list', async () => {
      // Arrange
      const request: GetFriendsRequest = {
        page: 1,
        size: 10,
      };

      mockUsersService.getFriends.mockResolvedValue([]);

      // Act
      const result = await controller.getFriends(request);

      // Assert
      expect(usersService.getFriends).toHaveBeenCalledWith(request);
      expect(result).toEqual([]);
    });

    it('should validate GetFriendsRequest correctly', async () => {
      // Arrange
      const validRequest = new GetFriendsRequest();
      validRequest.page = 1;
      validRequest.size = 10;
      validRequest.keyword = 'test';

      const validRequest2 = new GetFriendsRequest();
      validRequest2.page = 1;
      validRequest2.size = 10;
      // Keyword là optional, không cần thiết lập

      const invalidRequest = new GetFriendsRequest();
      invalidRequest.page = 0; // Min là 1
      invalidRequest.size = 10;

      const invalidRequest2 = new GetFriendsRequest();
      invalidRequest2.page = 1;
      invalidRequest2.size = 0; // Min là 1

      const invalidRequest3 = new GetFriendsRequest();
      invalidRequest3.page = 1;
      invalidRequest3.size = 10;
      invalidRequest3.keyword = 123 as any; // Không phải string

      // Act & Assert
      const validationErrors1 = await validate(validRequest);
      const validationErrors2 = await validate(validRequest2);
      const validationErrors3 = await validate(invalidRequest);
      const validationErrors4 = await validate(invalidRequest2);
      const validationErrors5 = await validate(invalidRequest3);

      expect(validationErrors1.length).toBe(0);
      expect(validationErrors2.length).toBe(0);
      expect(validationErrors3.length).toBeGreaterThan(0);
      expect(validationErrors4.length).toBeGreaterThan(0);
      expect(validationErrors5.length).toBeGreaterThan(0);
    });
  });
});
