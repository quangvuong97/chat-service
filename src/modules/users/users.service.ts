import { Injectable } from '@nestjs/common';
import { GetFriendResponse, GetProfileResponse } from './dto/user.response';
import { UserRepository } from 'src/database/user/user.repository';
import { UserContext } from 'src/common/asyncLocalStorage/userContext';
import { BadRequestException } from 'src/common/exceptions/badRequest.exception';
import { ErrorConfig } from 'src/common/exceptions/errorConfig';
import { AsyncLocalStorage } from 'async_hooks';
import { GetFriendsRequest } from './dto/user.request';
/**
 * @Injectable()
 * @description This is a class for the users service
 */
@Injectable()
export class UsersService {
  /**
   * @constructor
   * @description This is a constructor for the users service
   */
  constructor(
    private readonly userRepo: UserRepository,
    private readonly als: AsyncLocalStorage<UserContext>,
  ) {}

  /**
   * @method getProfile
   * @description This is a method for the users service to get the profile of the current user
   */
  async getProfile(): Promise<GetProfileResponse> {
    // get user context
    const userContext = this.als.getStore() as UserContext;
    // find user by id
    const user = await this.userRepo.findById(userContext.userId);
    // if user not found, throw error
    if (!user) {
      throw new BadRequestException(ErrorConfig.USER_NOT_FOUND);
    }
    // return user profile
    return {
      userId: user.id,
      username: user.username,
    };
  }

  /**
   * @method getFriends
   * @description This is a method for the users service to get the list of friends
   */
  async getFriends(request: GetFriendsRequest): Promise<GetFriendResponse[]> {
    // get user context
    const userContext = this.als.getStore() as UserContext;
    // get friends
    const friends = await this.userRepo.getFriends(userContext.userId, request);
    // return friends
    return friends.map((friend) => friend.toGetFriendResponse());
  }
}
