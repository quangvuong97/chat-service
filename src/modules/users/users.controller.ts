import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiResponse } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { GetProfileResponse, GetFriendResponse } from './dto/user.response';
import { GetFriendsRequest } from './dto/user.request';
/**
 * @Controller('users')
 * @description This is a controller for the users
 */
@Controller('users')
export class UsersController {
  /**
   * @constructor
   * @description This is a constructor for the users controller
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * @method getProfile
   * @description This is a method for the users controller to get the profile of the current user
   */
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

  @ApiOperation({ summary: 'Get the list of friends' })
  @ApiResponse({
    status: 200,
    description: 'The list of friends',
    type: GetFriendResponse,
    isArray: true,
  })
  @Get('friends')
  getFriends(
    @Query() request: GetFriendsRequest,
  ): Promise<GetFriendResponse[]> {
    return this.usersService.getFriends(request);
  }
}
