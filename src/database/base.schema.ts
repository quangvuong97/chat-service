import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export class BaseEntity {
  id: string;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: null })
  updatedAt: Date;

  @Prop({ type: String, default: null })
  createdBy?: string;

  @Prop({ type: String, default: null })
  updatedBy: string;

  initBase(userId?: Types.ObjectId) {
    this.deleted = false;
    this.createdAt = new Date();
    this.createdBy = userId?.toString();
  }

  delete(userId: Types.ObjectId) {
    this.deleted = true;
    this.updatedBy = userId.toJSON();
    this.updatedAt = new Date();
  }
}
