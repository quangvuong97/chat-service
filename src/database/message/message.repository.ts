import { AsyncLocalStorage } from 'async_hooks';
import { UserContext } from 'src/common/asyncLocalStorage/userContext';
import { HydratedDocument } from 'mongoose';
import { Message } from './message.schema';
import { Model } from 'mongoose';
import { BaseRepository } from '../base.repository';
import { CustomMongooseRepository } from '../mongooseCustom.decorator';
import { GetListMessageRequest } from 'src/modules/groupChat/dto/groupChat.request';
import { Types } from 'mongoose';

/**
 * @class GroupChatRepository
 * @description This is a class for the group chat repository
 */
@CustomMongooseRepository(Message)
export class MessageRepository extends BaseRepository<Message> {
  /**
   * @constructor
   * @description This is a constructor for the group chat repository
   */
  constructor(
    readonly model: Model<HydratedDocument<Message>>,
    private readonly als: AsyncLocalStorage<UserContext>,
  ) {
    super(model);
  }

  async getList(groupId: Types.ObjectId, request: GetListMessageRequest) {
    return this.model
      .find({ groupId })
      .skip((request.page - 1) * request.size)
      .limit(request.size)
      .sort({ createdAt: -1 })
      .exec();
  }
}
