import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { USER_ROLES } from '../../../../../common/auth/user-role';

export type UserDocument = HydratedDocument<UserMongo>;

@Schema({ timestamps: true, collection: 'users' })
export class UserMongo {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ required: true, enum: USER_ROLES, default: 'CUSTOMER' })
  role!: string;

  @Prop({ default: true })
  isActive!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserMongo);
UserSchema.index({ email: 1 }, { unique: true });
