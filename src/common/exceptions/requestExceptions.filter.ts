import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { BadRequestException } from './badRequest.exception';

@Catch()
export class RequestExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const ctxResponse = ctx.getResponse();
    const ctxRequest = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : new BadRequestException(
            (exception as Error)?.message || 'Internal server error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ).getResponse();

    Logger.error({
      message: (exception as Error)?.message || exception,
      stack: (exception as Error)?.stack,
      payload: JSON.stringify(ctxRequest.body),
      path: ctxRequest.url,
    });

    return ctxResponse.status(status).send(message);
  }
}
