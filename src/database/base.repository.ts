import { ClientSession, HydratedDocument, Model } from 'mongoose';

export class BaseRepository<T> {
  constructor(readonly model: Model<HydratedDocument<T>>) {}

  async runInTransaction<K>(
    fn: (session: ClientSession) => Promise<K>,
  ): Promise<K> {
    const session = await this.model.startSession(); // Lấy session từ model
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
