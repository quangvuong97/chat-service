import { HttpStatus } from '@nestjs/common';

/**
 * @interface SuccessResponseData
 * @description This is an interface for the success response data
 */
interface SuccessResponseData<T> {
  data: T;
  totalPages?: number;
  page?: number;
  size?: number;
  totalElements?: number;
}

/**
 * @class SuccessResponse
 * @description This is a class for the success response
 */
export class SuccessResponse<T> {
  private code = HttpStatus.OK;

  private statusCode = HttpStatus.OK;

  private message: string;

  private data: T;

  private totalPages?: number;

  private page?: number;

  private size?: number;

  private totalElements?: number;

  /**
   * @constructor
   * @description This is a constructor for the success response
   */
  constructor(
    { data, totalPages, page, size, totalElements }: SuccessResponseData<T>,
    message?: string,
  ) {
    this.message = message || 'Thành công';
    this.data = data;
    this.totalPages = totalPages;
    this.page = page;
    this.size = size;
    this.totalElements = totalElements;
  }
}
