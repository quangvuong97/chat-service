import { ApiProperty } from '@nestjs/swagger';

export class GetProfileResponse {
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
