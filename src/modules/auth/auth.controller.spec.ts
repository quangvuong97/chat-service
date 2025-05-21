import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginRequest, RegisterRequest } from './dto/auth.request';
import { LoginResponse, RegisterResponse } from './dto/auth.response';
import { validate } from 'class-validator';

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

    it('should validate RegisterRequest correctly', async () => {
      // Arrange
      const validRequest = new RegisterRequest();
      validRequest.username = 'testuser';
      validRequest.password = 'password123';

      const invalidRequest1 = new RegisterRequest();
      invalidRequest1.username = '';
      invalidRequest1.password = 'password123';

      const invalidRequest2 = new RegisterRequest();
      invalidRequest2.username = 'testuser';
      invalidRequest2.password = '';

      const invalidRequest3 = new RegisterRequest();
      // Không có username và password

      // Act & Assert
      const validationErrors1 = await validate(validRequest);
      const validationErrors2 = await validate(invalidRequest1);
      const validationErrors3 = await validate(invalidRequest2);
      const validationErrors4 = await validate(invalidRequest3);

      expect(validationErrors1.length).toBe(0);
      expect(validationErrors2.length).toBeGreaterThan(0);
      expect(validationErrors3.length).toBeGreaterThan(0);
      expect(validationErrors4.length).toBeGreaterThan(0);
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

    it('should validate LoginRequest correctly', async () => {
      // Arrange
      const validRequest = new LoginRequest();
      validRequest.username = 'testuser';
      validRequest.password = 'password123';

      const invalidRequest1 = new LoginRequest();
      invalidRequest1.username = '';
      invalidRequest1.password = 'password123';

      const invalidRequest2 = new LoginRequest();
      invalidRequest2.username = 'testuser';
      invalidRequest2.password = '';

      const invalidRequest3 = new LoginRequest();
      // Không có username và password

      // Act & Assert
      const validationErrors1 = await validate(validRequest);
      const validationErrors2 = await validate(invalidRequest1);
      const validationErrors3 = await validate(invalidRequest2);
      const validationErrors4 = await validate(invalidRequest3);

      expect(validationErrors1.length).toBe(0);
      expect(validationErrors2.length).toBeGreaterThan(0);
      expect(validationErrors3.length).toBeGreaterThan(0);
      expect(validationErrors4.length).toBeGreaterThan(0);
    });
  });
});
