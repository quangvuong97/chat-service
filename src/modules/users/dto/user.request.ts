import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { IsString } from 'class-validator';

import { PagingFilterRequest } from 'src/common/pagingFilter.request';

/**
 * @class GetFriendsRequest
 * @description This is a class for the get friends request
 */
export class GetFriendsRequest extends PagingFilterRequest {
  /**
   * @property keyword
   * @description This is a property for the keyword
   */
  @ApiPropertyOptional({
    description: 'The keyword',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  keyword?: string;
}
