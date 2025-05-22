import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest, RegisterRequest } from './dto/auth.request';
import { RegisterResponse, LoginResponse } from './dto/auth.response';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/common/decorator/public';

/**
 * @Controller('auth')
 * @description Controller provides and processes endpoints related to user authentication (Login, Register,...).
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
