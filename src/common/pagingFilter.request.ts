import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

/**
 * @class PagingFilterRequest
 * @description This is a class for the paging filter request
 */
export class PagingFilterRequest {
  @ApiProperty({ required: false, default: 250, type: Number })
  @IsOptional()
  @Transform((params: TransformFnParams) => Number(params.value) || null)
  @IsInt()
  @Min(1)
  size = 250;

  @ApiProperty({ required: false, default: 1, type: Number })
  @IsOptional()
  @Transform((params: TransformFnParams) => Number(params.value) || null)
  @IsInt()
  @Min(1)
  page = 1;
}
