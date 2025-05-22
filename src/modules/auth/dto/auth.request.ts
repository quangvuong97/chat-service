import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginRequest {
  @ApiProperty({
    description: 'The username of the user',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterRequest {
  @ApiProperty({
    description: 'The username of the user',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
