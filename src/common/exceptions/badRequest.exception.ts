import { HttpException, HttpStatus } from '@nestjs/common';

import { ErrorConfig } from './errorConfig';

/**
 * @constant ReverseErrorConfig
 * @description This is a constant for the reverse error config
 */
const ReverseErrorConfig = Object.entries(ErrorConfig).reduce<
  Record<string, keyof typeof ErrorConfig>
>((acc, [key, value]: [keyof typeof ErrorConfig, string]) => {
  acc[value] = key;
  return acc;
}, {});

/**
 * @class BadRequestException
 * @description This is a class for the bad request exception
 */
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
