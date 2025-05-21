import { AsyncLocalStorage } from 'async_hooks';
import { UserContext } from 'src/common/asyncLocalStorage/userContext';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { BaseRepository } from '../base.repository';
import { CustomMongooseRepository } from '../mongooseCustom.decorator';

@CustomMongooseRepository(User)
export class UserRepository extends BaseRepository<User> {
  constructor(
    readonly model: Model<HydratedDocument<User>>,
    private readonly als: AsyncLocalStorage<UserContext>,
  ) {
    super(model);
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.model.findOne({ username, deleted: false });
  }

  async findById(id: Types.ObjectId): Promise<User | null> {
    return this.model.findById(id, { deleted: false });
  }
}
