import { ApiProperty } from '@nestjs/swagger';

/**
 * @class GetProfileResponse
 * @description This is a class for the get profile response
 */
export class GetProfileResponse {
  /**
   * @property userId
   * @description This is a property for the id of the user
   */
  @ApiProperty({
    description: 'The id of the user',
    example: '1234567890',
  })
  userId: string;

  /**
   * @property username
   * @description This is a property for the username of the user
   */
  @ApiProperty({
    description: 'The username of the user',
    example: 'john_doe',
  })
  username: string;
}

export class GetFriendResponse {
  @ApiProperty({
    description: 'The id of the user',
    example: '1234567890',
  })
  userId: string;

  @ApiProperty({
    description: 'The username of the user',
    example: 'john_doe',
  })
  username: string;
}
