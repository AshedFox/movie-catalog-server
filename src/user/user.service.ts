import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserModel } from './entities/user.model';
import { PaginatedUsers } from './dto/paginated-users.result';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundError } from '../shared/errors/not-found.error';
import { AlreadyExistsError } from '../shared/errors/already-exists.error';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<UserModel> {
    const user = await this.userRepository.findOne({
      email: createUserInput.email,
    });
    if (user) {
      throw new AlreadyExistsError();
    }
    return this.userRepository.save(createUserInput);
  }

  async readAll(take: number, skip: number): Promise<PaginatedUsers> {
    const [data, count] = await this.userRepository.findAndCount({
      take,
      skip,
      order: {
        email: 'ASC',
      },
    });

    return { data, count, hasNext: count >= take + skip };
  }

  async readAllByIds(ids: string[]): Promise<UserModel[]> {
    return await this.userRepository.findByIds(ids);
  }

  async readOneById(id: string): Promise<UserModel> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundError();
    }
    return user;
  }

  async readOneByEmail(email: string): Promise<UserModel> {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new NotFoundError();
    }
    return user;
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
  ): Promise<UserModel> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundError();
    }
    return this.userRepository.save({
      ...user,
      ...updateUserInput,
    });
  }

  async setEmailConfirmed(id: string) {
    await this.userRepository.update(id, { isEmailConfirmed: true });
  }

  async delete(id: string): Promise<boolean> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundError();
    }
    await this.userRepository.remove(user);
    return true;
  }
}
