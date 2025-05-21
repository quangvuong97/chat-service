import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GetProfileResponse } from './dto/user.response';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    getProfile: jest.fn(),
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
});
