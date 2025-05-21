import { AsyncLocalStorage } from 'async_hooks';
import { UserContext } from 'src/common/asyncLocalStorage/userContext';
import { HydratedDocument } from 'mongoose';
import { GroupChat } from './groupChat.schema';
import { Model } from 'mongoose';
import { BaseRepository } from '../base.repository';
import { CustomMongooseRepository } from '../mongooseCustom.decorator';
import { Types } from 'mongoose';
import { GetListGroupChatRequest } from 'src/modules/groupChat/dto/groupChat.request';
/**
 * @class GroupChatRepository
 * @description This is a class for the group chat repository
 */
@CustomMongooseRepository(GroupChat)
export class GroupChatRepository extends BaseRepository<GroupChat> {
  /**
   * @constructor
   * @description This is a constructor for the group chat repository
   */
  constructor(
    readonly model: Model<HydratedDocument<GroupChat>>,
    private readonly als: AsyncLocalStorage<UserContext>,
  ) {
    super(model);
  }

  async getById(id: Types.ObjectId) {
    return this.model.findById(id, { deleted: false });
  }

  async getMyList(userId: Types.ObjectId, request: GetListGroupChatRequest) {
    const groupChats = await this.model
      .find({
        members: userId,
        deleted: false,
      })
      .skip((request.page - 1) * request.size)
      .limit(request.size)
      .sort({ updatedAt: -1 })
      .exec();
    return groupChats;
  }
}
