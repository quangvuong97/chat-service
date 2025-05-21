import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiResponse } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { GetProfileResponse } from './dto/user.response';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get the profile of the current user' })
  @ApiResponse({
    status: 200,
    description: 'The profile of the current user',
    type: GetProfileResponse,
  })
  @Get('profile')
  getProfile(): Promise<GetProfileResponse> {
    return this.usersService.getProfile();
  }
}
