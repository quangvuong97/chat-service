import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

/**
 * @class PagingFilterRequest
 * @description This is a class for the paging filter request
 */
export class PagingFilterRequest {
  /**
   * @property size
   * @description This is a property for the size of the paging filter request
   */
  @ApiProperty({ required: false, default: 250, type: Number })
  @IsOptional()
  @Transform((params: TransformFnParams) => Number(params.value) || null)
  @IsInt()
  @Min(1)
  size = 250;

  /**
   * @property page
   * @description This is a property for the page of the paging filter request
   */
  @ApiProperty({ required: false, default: 1, type: Number })
  @IsOptional()
  @Transform((params: TransformFnParams) => Number(params.value) || null)
  @IsInt()
  @Min(1)
  page = 1;
}
