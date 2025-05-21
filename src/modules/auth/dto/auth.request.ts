import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * @class LoginRequest
 * @description This is a class for the login request
 */
export class LoginRequest {
  /**
   * @property username
   * @description This is a property for the username from the request
   */
  @ApiProperty({
    description: 'The username of the user',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  /**
   * @property password
   * @description This is a property for the password from the request
   */
  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

/**
 * @class RegisterRequest
 * @description This is a class for the register request
 */
export class RegisterRequest {
  /**
   * @property username
   * @description This is a property for the username from the request
   */
  @ApiProperty({
    description: 'The username of the user',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  /**
   * @property password
   * @description This is a property for the password from the request
   */
  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
