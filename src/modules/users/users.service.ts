import { Injectable } from '@nestjs/common';
import { GetProfileResponse } from './dto/user.response';
import { UserRepository } from 'src/database/user/user.repository';
import { UserContext } from 'src/common/asyncLocalStorage/userContext';
import { BadRequestException } from 'src/common/exceptions/badRequest.exception';
import { ErrorConfig } from 'src/common/exceptions/errorConfig';
import { AsyncLocalStorage } from 'async_hooks';
@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly als: AsyncLocalStorage<UserContext>,
  ) {}

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
}
