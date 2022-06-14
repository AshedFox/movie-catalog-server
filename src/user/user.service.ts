import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserModel } from './entities/user.model';
import { PaginatedUsers } from './dto/paginated-users.result';

@Injectable()
export class UserService {
  async create(createUserInput: CreateUserInput): Promise<UserModel> {
    const user = await UserModel.create(createUserInput);
    return user.save();
  }

  async findAll(take: number, skip: number): Promise<PaginatedUsers> {
    const [data, count] = await UserModel.findAndCount({
      take,
      skip,
      order: {
        email: 'ASC',
      },
    });

    return { data, count, hasNext: count >= take + skip };
  }

  async readOneById(id: string): Promise<UserModel> {
    return UserModel.findOne(id);
  }

  async readOneByEmail(email: string): Promise<UserModel> {
    return UserModel.findOne({ where: { email } });
  }

  async update(id: string, input: UpdateUserInput): Promise<UserModel> {
    await UserModel.update(id, input);
    return UserModel.findOne(id);
  }

  async setEmailConfirmed(id: string) {
    await UserModel.update(id, { isEmailConfirmed: true });
  }

  async delete(id: string): Promise<boolean> {
    return !!(await UserModel.delete(id));
  }
}
