import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { IS_PUBLIC_KEY } from 'src/common/decorator/public';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    let mockExecutionContext: ExecutionContext;
    let mockRequest: any;

    beforeEach(() => {
      mockRequest = {
        headers: {},
      };

      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;
    });

    it('should return true for public routes', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(true);

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(
        IS_PUBLIC_KEY,
        [mockExecutionContext.getHandler(), mockExecutionContext.getClass()],
      );
    });

    it('should throw UnauthorizedException when no token is provided', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      mockRequest.headers.authorization = undefined;

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when token verification fails', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      mockRequest.headers.authorization = 'Bearer fakeToken';
      mockJwtService.verifyAsync.mockRejectedValue(
        new Error('Token verification failed'),
      );
      mockConfigService.get.mockReturnValue('secretKey');

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('fakeToken', {
        secret: 'secretKey',
      });
    });

    it('should set user in request and return true when token is valid', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      mockRequest.headers.authorization = 'Bearer validToken';

      const payload = { userId: '123', username: 'test' };
      mockJwtService.verifyAsync.mockResolvedValue(payload);
      mockConfigService.get.mockReturnValue('secretKey');

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(mockRequest.user).toEqual(payload);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('validToken', {
        secret: 'secretKey',
      });
    });

    it('should handle non-bearer tokens correctly', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      mockRequest.headers.authorization = 'Basic fakeToken';

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
