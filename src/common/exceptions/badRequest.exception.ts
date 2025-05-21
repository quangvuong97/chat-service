import { HttpException, HttpStatus } from '@nestjs/common';

import { ErrorConfig } from './errorConfig';

const ReverseErrorConfig = Object.entries(ErrorConfig).reduce<
  Record<string, keyof typeof ErrorConfig>
>((acc, [key, value]: [keyof typeof ErrorConfig, string]) => {
  acc[value] = key;
  return acc;
}, {});

export class BadRequestException extends HttpException {
  constructor(errorCode: string, status?: HttpStatus) {
    const key = ReverseErrorConfig[errorCode]?.toLocaleLowerCase();
    super(
      {
        code: key || 'error',
        message: errorCode,
        statusCode: status || HttpStatus.UNPROCESSABLE_ENTITY,
      },
      status || HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
