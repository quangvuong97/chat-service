import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest, RegisterRequest } from './dto/auth.request';
import { RegisterResponse, LoginResponse } from './dto/auth.response';
import { ApiResponse } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/common/decorator/public';

/**
 * @Controller('auth')
 * @description This is a controller for the auth
 */
@Controller('auth')
export class AuthController {
  /**
   * @constructor
   * @description This is a constructor for the auth controller
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * @method register
   * @description This is a method for the auth controller to register a new user
   */
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully registered.',
    type: RegisterResponse,
  })
  @Post('register')
  @Public()
  register(@Body() request: RegisterRequest): Promise<RegisterResponse> {
    return this.authService.register(request);
  }

  /**
   * @method login
   * @description This is a method for the auth controller to login a user
   */
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
    type: LoginResponse,
  })
  @Post('login')
  @Public()
  login(@Body() request: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(request);
  }
}
