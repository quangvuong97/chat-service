import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginRequest, RegisterRequest } from './dto/auth.request';
import { LoginResponse, RegisterResponse } from './dto/auth.response';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register with correct parameters', async () => {
      // Arrange
      const registerRequest: RegisterRequest = {
        username: 'testuser',
        password: 'password123',
      };
      const expectedResponse: RegisterResponse = {
        accessToken: 'test-token',
      };
      mockAuthService.register.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.register(registerRequest);

      // Assert
      expect(authService.register).toHaveBeenCalledWith(registerRequest);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('login', () => {
    it('should call authService.login with correct parameters', async () => {
      // Arrange
      const loginRequest: LoginRequest = {
        username: 'testuser',
        password: 'password123',
      };
      const expectedResponse: LoginResponse = {
        accessToken: 'test-token',
      };
      mockAuthService.login.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.login(loginRequest);

      // Assert
      expect(authService.login).toHaveBeenCalledWith(loginRequest);
      expect(result).toEqual(expectedResponse);
    });
  });
});
