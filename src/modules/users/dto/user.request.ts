import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { IsString } from 'class-validator';

import { PagingFilterRequest } from 'src/common/pagingFilter.request';

export class GetFriendsRequest extends PagingFilterRequest {
  @ApiPropertyOptional({
    description: 'The keyword',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  keyword?: string;
}
