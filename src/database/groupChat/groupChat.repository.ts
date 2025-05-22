import { AsyncLocalStorage } from 'async_hooks';
import { UserContext } from 'src/common/asyncLocalStorage/userContext';
import { HydratedDocument } from 'mongoose';
import { GroupChat } from './groupChat.schema';
import { Model } from 'mongoose';
import { BaseRepository } from '../base.repository';
import { CustomMongooseRepository } from '../mongooseCustom.decorator';
import { Types } from 'mongoose';
import { GetListGroupChatRequest } from 'src/modules/groupChat/dto/groupChat.request';
import { EGroupChatType } from './groupChat.type';

@CustomMongooseRepository(GroupChat)
export class GroupChatRepository extends BaseRepository<GroupChat> {
  constructor(
    readonly model: Model<HydratedDocument<GroupChat>>,
    private readonly als: AsyncLocalStorage<UserContext>,
  ) {
    super(model);
  }

  /**
   * @method getById
   * @description This is a method for the group chat repository to get the group chat by id
   */
  async getById(id: Types.ObjectId) {
    return this.model.findById(id, { deleted: false });
  }

  /**
   * @method getMyList
   * @description This is a method for the group chat repository to get the list of group chats
   */
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

  /**
   * @method getByMembers
   * @description This is a method for the group chat repository to get the group chat by members
   */
  async getByMembers(members: Types.ObjectId[]) {
    return this.model.findOne({
      members: { $all: members },
      type: EGroupChatType.PERSONAL,
    });
  }
}
