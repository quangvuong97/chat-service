import { AsyncLocalStorage } from 'async_hooks';
import { UserContext } from 'src/common/asyncLocalStorage/userContext';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { BaseRepository } from '../base.repository';
import { CustomMongooseRepository } from '../mongooseCustom.decorator';
import { GetFriendsRequest } from 'src/modules/users/dto/user.request';

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
   * @description Find a user based on the username.
   * Only return the user that has not been deleted (deleted = false).
   * @param username - The username to search for
   * @returns Promise containing the User object if found, null if not found
   */
  async findOneByUsername(username: string): Promise<User | null> {
    return this.model.findOne({ username, deleted: false });
  }

  /**
   * @method findById
   * @description Find a user based on the ID.
   * Only return the user that has not been deleted (deleted = false).
   * @param id - The ID of the user to search for
   * @returns Promise containing the User object if found, null if not found
   */
  async findById(id: Types.ObjectId): Promise<User | null> {
    return this.model.findById(id, { deleted: false });
  }

  /**
   * @method findByIds
   * @description Find multiple users based on the list of IDs.
   * Only return the users that have not been deleted (deleted = false).
   * @param ids - The list of IDs of the users to search for
   * @returns Promise containing the array of User objects found
   */
  async findByIds(ids: Types.ObjectId[]): Promise<User[]> {
    return this.model.find({ _id: { $in: ids }, deleted: false });
  }

  /**
   * @method getFriends
   * @description Get the list of friends (other users) that can be filtered by keyword.
   * Supports pagination and sorting the results by the latest update time.
   * Only return the users that have not been deleted (deleted = false).
   * @param userId - The ID of the current user (to exclude from the result)
   * @param request - The request data containing the search keyword and pagination information
   * @returns Promise containing the array of User objects that meet the conditions
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
