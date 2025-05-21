import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/database/user/user.repository';
import { UnauthorizedException } from '@nestjs/common';
import { BadRequestException } from 'src/common/exceptions/badRequest.exception';
import { LoginRequest, RegisterRequest } from './dto/auth.request';
import { User } from 'src/database/user/user.schema';
import * as bcrypt from 'bcrypt';

// Chỉ mock bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepository = {
    findOneByUsername: jest.fn(),
    model: {
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw BadRequestException if user already exists', async () => {
      // Arrange
      const registerRequest: RegisterRequest = {
        username: 'existinguser',
        password: 'password123',
      };

      mockUserRepository.findOneByUsername.mockResolvedValue({
        id: 'user-id',
        username: 'existinguser',
      });

      // Act & Assert
      await expect(service.register(registerRequest)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockUserRepository.findOneByUsername).toHaveBeenCalledWith(
        registerRequest.username,
      );
    });

    it('should create a new user and return an access token', async () => {
      // Arrange
      const registerRequest: RegisterRequest = {
        username: 'newuser',
        password: 'password123',
      };

      const hashedPassword = 'hashed-password';
      const newUser = new User(registerRequest.username, hashedPassword);
      newUser.id = 'user-id';

      const token = 'generated-token';

      mockUserRepository.findOneByUsername.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockJwtService.sign.mockReturnValue(token);

      // Act
      const result = await service.register(registerRequest);

      // Assert
      expect(mockUserRepository.findOneByUsername).toHaveBeenCalledWith(
        registerRequest.username,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(registerRequest.password, 10);
      expect(mockJwtService.sign).toHaveBeenCalled();
      expect(result).toEqual({ accessToken: token });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user does not exist', async () => {
      // Arrange
      const loginRequest: LoginRequest = {
        username: 'nonexistentuser',
        password: 'password123',
      };

      mockUserRepository.findOneByUsername.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginRequest)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserRepository.findOneByUsername).toHaveBeenCalledWith(
        loginRequest.username,
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      // Arrange
      const loginRequest: LoginRequest = {
        username: 'existinguser',
        password: 'wrongpassword',
      };

      const existingUser = new User('existinguser', 'hashed-password');

      mockUserRepository.findOneByUsername.mockResolvedValue(existingUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(service.login(loginRequest)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserRepository.findOneByUsername).toHaveBeenCalledWith(
        loginRequest.username,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginRequest.password,
        existingUser.password,
      );
    });

    it('should return an access token when login is successful', async () => {
      // Arrange
      const loginRequest: LoginRequest = {
        username: 'existinguser',
        password: 'correctpassword',
      };

      const existingUser = new User('existinguser', 'hashed-password');
      existingUser.id = 'user-id';

      const token = 'generated-token';

      mockUserRepository.findOneByUsername.mockResolvedValue(existingUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(token);

      // Act
      const result = await service.login(loginRequest);

      // Assert
      expect(mockUserRepository.findOneByUsername).toHaveBeenCalledWith(
        loginRequest.username,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginRequest.password,
        existingUser.password,
      );
      expect(mockJwtService.sign).toHaveBeenCalled();
      expect(result).toEqual({ accessToken: token });
    });
  });
});
