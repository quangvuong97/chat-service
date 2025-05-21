import { AsyncLocalStorage } from 'async_hooks';
import { UserContext } from 'src/common/asyncLocalStorage/userContext';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { BaseRepository } from '../base.repository';
import { CustomMongooseRepository } from '../mongooseCustom.decorator';
import { GetFriendsRequest } from 'src/modules/users/dto/user.request';

/**
 * @class UserRepository
 * @description This is a class for the user repository
 */
@CustomMongooseRepository(User)
export class UserRepository extends BaseRepository<User> {
  constructor(
    readonly model: Model<HydratedDocument<User>>,
    private readonly als: AsyncLocalStorage<UserContext>,
  ) {
    super(model);
  }

  /**
   * @method findOneByUsername
   * @description This is a method for the user repository to find one by username
   */
  async findOneByUsername(username: string): Promise<User | null> {
    return this.model.findOne({ username, deleted: false });
  }

  /**
   * @method findById
   * @description This is a method for the user repository to find one by id
   */
  async findById(id: Types.ObjectId): Promise<User | null> {
    return this.model.findById(id, { deleted: false });
  }

  /**
   * @method findByIds
   * @description This is a method for the user repository to find many by ids
   */
  async findByIds(ids: Types.ObjectId[]): Promise<User[]> {
    return this.model.find({ _id: { $in: ids }, deleted: false });
  }

  /**
   * @method getFriends
   * @description This is a method for the user repository to get the list of friends
   */
  async getFriends(
    userId: Types.ObjectId,
    request: GetFriendsRequest,
  ): Promise<User[]> {
    // build query
    const query: any = { _id: { $ne: userId }, deleted: false };

    // if keyword is provided, add to query
    if (request.keyword) {
      query.username = { $regex: request.keyword, $options: 'i' };
    }

    // get friends
    return this.model
      .find(query)
      .skip((request.page - 1) * request.size)
      .limit(request.size)
      .sort({ updatedAt: -1 })
      .exec();
  }
}
