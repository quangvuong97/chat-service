import { ClientSession, HydratedDocument, Model } from 'mongoose';

/**
 * @class BaseRepository
 * @description This is a class for the base repository
 */
export class BaseRepository<T> {
  constructor(readonly model: Model<HydratedDocument<T>>) {}

  /**
   * @method runInTransaction
   * @description This is a method for the base repository to run in transaction
   */
  async runInTransaction<K>(
    fn: (session: ClientSession) => Promise<K>,
  ): Promise<K> {
    const session = await this.model.startSession();
    session.startTransaction();

    try {
      const result = await fn(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
