import { Prop, Schema } from '@nestjs/mongoose';
import { BaseEntity } from '../base.schema';

// tạo bảng user
@Schema({ collection: 'users' })
export class User extends BaseEntity {
  constructor(username: string, password: string) {
    super();
    this.username = username;
    this.password = password;
  }

  @Prop({ type: String })
  username: string; // tên đăng nhập

  @Prop({ type: String })
  password: string; // mật khẩu
}
