import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

/**
 * @class BaseEntity
 * @description This is a class for the base entity
 */
export class BaseEntity {
  /**
   * @property id
   * @description This is a property for the id
   */
  id: string;

  /**
   * @property deleted
   * @description This is a property for the deleted
   */
  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  /**
   * @property createdAt
   * @description This is a property for the created at
   */
  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  /**
   * @property updatedAt
   * @description This is a property for the updated at
   */
  @Prop({ type: Date, default: null })
  updatedAt: Date;

  /**
   * @property createdBy
   * @description This is a property for the created by
   */
  @Prop({ type: String, default: null })
  createdBy: string;

  /**
   * @property updatedBy
   * @description This is a property for the updated by
   */
  @Prop({ type: String, default: null })
  updatedBy: string;

  /**
   * @method initBase
   * @description This is a method for the base entity to init
   */
  initBase(userId: Types.ObjectId) {
    this.deleted = false;
    this.createdAt = new Date();
    this.createdBy = userId.toString();
  }

  /**
   * @method delete
   * @description This is a method for the base entity to delete
   */
  delete(userId: Types.ObjectId) {
    this.deleted = true;
    this.updatedBy = userId.toJSON();
    this.updatedAt = new Date();
  }
}
