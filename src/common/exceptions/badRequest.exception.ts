import { HttpException, HttpStatus } from '@nestjs/common';

import { ErrorConfig } from './errorConfig';

// Invert the mapping of ErrorConfig to allow looking up keys from values.
// Convert from the structure { KEY: 'value' } to { 'value': 'KEY' }.
const ReverseErrorConfig = Object.entries(ErrorConfig).reduce<
  Record<string, keyof typeof ErrorConfig>
>((acc, [key, value]: [keyof typeof ErrorConfig, string]) => {
  acc[value] = key;
  return acc;
}, {});

export class BadRequestException extends HttpException {
  /**
   * @constructor
   * @description Initialize an exception with an error code and optional HTTP status.
   * @param errorCode - Error code from ErrorConfig or custom error message
   * @param status - HTTP status code (default is 422 UNPROCESSABLE_ENTITY)
   */
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
