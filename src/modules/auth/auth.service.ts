import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginRequest, RegisterRequest } from './dto/auth.request';
import { UserRepository } from 'src/database/user/user.repository';
import { compare, hash } from 'bcrypt';
import { User } from 'src/database/user/user.schema';
import { LoginResponse, RegisterResponse } from './dto/auth.response';
import { BadRequestException } from 'src/common/exceptions/badRequest.exception';
import { ErrorConfig } from 'src/common/exceptions/errorConfig';

/**
 * @Injectable()
 * @description Service handles user authentication functionalities.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userRepo: UserRepository,
  ) {}

  /**
   * @method register
   * @description Register a new user in the system.
   */
  async register(request: RegisterRequest): Promise<RegisterResponse> {
    // check if user already exists
    const user = await this.userRepo.findOneByUsername(request.username);
    if (user) {
      throw new BadRequestException(ErrorConfig.USER_ALREADY_EXISTS);
    }
    // hash password
    const hashed = await hash(request.password, 10);
    // create new user
    const newUser = new User(request.username, hashed);
    const userSaved = await this.userRepo.model.create(newUser);
    // generate token
    return {
      accessToken: this.generateToken(userSaved),
    };
  }

  /**
   * @method login
   * @description Authenticate and login user.
   */
  async login(request: LoginRequest): Promise<LoginResponse> {
    // check if user exists
    const user = await this.userRepo.findOneByUsername(request.username);
    if (!user || !(await compare(request.password, user.password))) {
      throw new UnauthorizedException(ErrorConfig.INVALID_CREDENTIALS);
    }
    // generate token
    return {
      accessToken: this.generateToken(user),
    };
  }

  /**
   * @method generateToken
   * @description Generate JWT token from user information.
   */
  private generateToken(user: User): string {
    return this.jwtService.sign({
      userId: user.id,
      username: user.username,
    });
  }
}
