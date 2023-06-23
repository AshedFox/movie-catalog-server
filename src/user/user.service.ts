import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserEntity } from './entities/user.entity';
import { PaginatedUsers } from './dto/paginated-users';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlreadyExistsError, NotFoundError } from '@utils/errors';
import { OffsetPaginationArgsType } from '@common/pagination/offset';
import { SortType } from '@common/sort';
import { FilterType } from '@common/filter';
import { parseArgsToQuery } from '@common/typeorm-query-parser';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  create = async (createUserInput: CreateUserInput): Promise<UserEntity> => {
    const { email } = createUserInput;
    const user = await this.userRepository.findOneBy({
      email,
    });
    if (user) {
      throw new AlreadyExistsError(
        `User with email "${email}" already exists!`,
      );
    }
    return this.userRepository.save(createUserInput);
  };

  readMany = async (
    pagination?: OffsetPaginationArgsType,
    sort?: SortType<UserEntity>,
    filter?: FilterType<UserEntity>,
  ): Promise<PaginatedUsers> => {
    const qb = parseArgsToQuery(this.userRepository, pagination, sort, filter);
    const { entities: data } = await qb.getRawAndEntities();
    const count = await qb.getCount();

    const { limit, offset } = pagination;

    return {
      nodes: data,
      pageInfo: {
        totalCount: count,
        hasNextPage: count > limit + offset,
        hasPreviousPage: offset > 0,
      },
    };
  };

  readOneById = async (id: string): Promise<UserEntity> => {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundError(`User with id "${id}" not found!`);
    }
    return user;
  };

  readOneByEmail = async (email: string): Promise<UserEntity> => {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundError(`User with email "${email}" not found!`);
    }
    return user;
  };

  update = async (
    id: string,
    updateUserInput: UpdateUserInput,
  ): Promise<UserEntity> => {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundError(`User with id "${id}" not found!`);
    }
    if (updateUserInput.email && updateUserInput.email !== user.email) {
      const userByEmail = await this.userRepository.findOneBy({
        email: updateUserInput.email,
      });

      if (!!userByEmail) {
        throw new AlreadyExistsError('User with this email already exists!');
      }
    }

    const updatedUser = await this.userRepository.save({
      ...user,
      ...updateUserInput,
      isEmailConfirmed:
        updateUserInput.email && user.email !== updateUserInput.email
          ? false
          : user.isEmailConfirmed,
    });

    return updatedUser;
  };

  updatePassword = async (
    id: string,
    oldPassword: string,
    newPassword: string,
  ) => {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundError(`User with id "${id}" not found!`);
    }

    if (!(await argon2.verify(user.password, oldPassword))) {
      throw new Error('User password incorrect!');
    }

    return this.userRepository.save({
      ...user,
      password: await argon2.hash(newPassword),
    });
  };

  setEmailConfirmed = async (id: string) => {
    await this.userRepository.update(id, { isEmailConfirmed: true });
  };

  delete = async (id: string): Promise<UserEntity> => {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundError(`User with id "${id}" not found!`);
    }
    return this.userRepository.remove(user);
  };
}
