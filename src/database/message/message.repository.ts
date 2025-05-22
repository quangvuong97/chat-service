import { AsyncLocalStorage } from 'async_hooks';
import { UserContext } from 'src/common/asyncLocalStorage/userContext';
import { HydratedDocument } from 'mongoose';
import { Message } from './message.schema';
import { Model } from 'mongoose';
import { BaseRepository } from '../base.repository';
import { CustomMongooseRepository } from '../mongooseCustom.decorator';
import { GetListMessageRequest } from 'src/modules/groupChat/dto/groupChat.request';
import { Types } from 'mongoose';

@CustomMongooseRepository(Message)
export class MessageRepository extends BaseRepository<Message> {
  constructor(
    readonly model: Model<HydratedDocument<Message>>,
    private readonly als: AsyncLocalStorage<UserContext>,
  ) {
    super(model);
  }

  /**
   * @method getList
   * @description This is a method for the message repository to get the list of messages
   */
  async getList(groupId: Types.ObjectId, request: GetListMessageRequest) {
    return this.model
      .find({ groupId })
      .skip((request.page - 1) * request.size)
      .limit(request.size)
      .sort({ createdAt: -1 })
      .exec();
  }
}
