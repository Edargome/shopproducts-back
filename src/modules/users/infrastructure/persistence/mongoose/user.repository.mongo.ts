import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserMongo } from './user.schema';
import { User } from '../../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../../domain/ports/user.repository.port';
import { UserMapper } from './user.mapper';

export class UserMongoRepository implements UserRepositoryPort {
  constructor(
    @InjectModel(UserMongo.name) private readonly model: Model<UserMongo>,
  ) {}

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  async create(user: User): Promise<User> {
    const created = await this.model.create({
      email: this.normalizeEmail(user.email),
      passwordHash: user.passwordHash,
      role: user.role,
      isActive: user.isActive ?? true,
    });

    return UserMapper.toDomain(created as any);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.model.findOne({ email: this.normalizeEmail(email) }).exec();
    return doc ? UserMapper.toDomain(doc as any) : null;
  }

  async findById(id: string): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.model.findById(id).exec();
    return doc ? UserMapper.toDomain(doc as any) : null;
  }
}
