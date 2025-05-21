import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponse {
  @ApiProperty({
    description: 'The access token of the user',
    example: '1234567890',
  })
  accessToken: string;
}

export class LoginResponse {
  @ApiProperty({
    description: 'The access token of the user',
    example: '1234567890',
  })
  accessToken: string;
}
