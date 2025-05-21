import { ApiProperty } from '@nestjs/swagger';

/**
 * @class RegisterResponse
 * @description This is a class for the register response
 */
export class RegisterResponse {
  /**
   * @property accessToken
   * @description This is a property for the access token of the user
   */
  @ApiProperty({
    description: 'The access token of the user',
    example: '1234567890',
  })
  accessToken: string;
}

/**
 * @class LoginResponse
 * @description This is a class for the login response
 */
export class LoginResponse {
  /**
   * @property accessToken
   * @description This is a property for the access token of the user
   */
  @ApiProperty({
    description: 'The access token of the user',
    example: '1234567890',
  })
  accessToken: string;
}
