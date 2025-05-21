import { Test, TestingModule } from '@nestjs/testing';
import { RequestExceptionsFilter } from './requestExceptions.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { BadRequestException } from './badRequest.exception';

describe('RequestExceptionsFilter', () => {
  let filter: RequestExceptionsFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestExceptionsFilter],
    }).compile();

    filter = module.get<RequestExceptionsFilter>(RequestExceptionsFilter);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    let mockArgumentsHost: ArgumentsHost;
    let mockResponse: any;
    let mockRequest: any;
    let mockHttpContext: any;
    let mockStatusResponse: any;

    beforeEach(() => {
      mockStatusResponse = {
        send: jest.fn().mockReturnThis(),
      };

      mockResponse = {
        status: jest.fn().mockReturnValue(mockStatusResponse),
      };

      mockRequest = {
        url: 'test-url',
        body: { test: 'data' },
      };

      mockHttpContext = {
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      };

      mockArgumentsHost = {
        switchToHttp: jest.fn().mockReturnValue(mockHttpContext),
      } as unknown as ArgumentsHost;
    });

    it('should handle HttpException correctly', () => {
      const mockHttpException = new HttpException(
        'Test exception',
        HttpStatus.BAD_REQUEST,
      );
      const mockExceptionResponse = mockHttpException.getResponse();

      filter.catch(mockHttpException, mockArgumentsHost);

      expect(mockArgumentsHost.switchToHttp).toHaveBeenCalled();
      expect(mockHttpContext.getResponse).toHaveBeenCalled();
      expect(mockHttpContext.getRequest).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockStatusResponse.send).toHaveBeenCalledWith(
        mockExceptionResponse,
      );
    });

    it('should handle non-HttpException with a BadRequestException', () => {
      const error = new Error('Test error');

      filter.catch(error, mockArgumentsHost);

      expect(mockArgumentsHost.switchToHttp).toHaveBeenCalled();
      expect(mockHttpContext.getResponse).toHaveBeenCalled();
      expect(mockHttpContext.getRequest).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockStatusResponse.send).toHaveBeenCalled();

      // Verify it creates a BadRequestException with the correct message
      const badRequestException = new BadRequestException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockStatusResponse.send).toHaveBeenCalledWith(
        badRequestException.getResponse(),
      );
    });

    it('should handle non-Error exceptions', () => {
      const nonErrorException = 'String exception';

      filter.catch(nonErrorException, mockArgumentsHost);

      expect(mockArgumentsHost.switchToHttp).toHaveBeenCalled();
      expect(mockHttpContext.getResponse).toHaveBeenCalled();
      expect(mockHttpContext.getRequest).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockStatusResponse.send).toHaveBeenCalled();

      // Verify it creates a BadRequestException with the correct message
      const badRequestException = new BadRequestException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockStatusResponse.send).toHaveBeenCalledWith(
        badRequestException.getResponse(),
      );
    });
  });
});
