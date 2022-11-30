import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserEntity } from './entities/user.entity';
import { PaginatedUsers } from './dto/paginated-users';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AlreadyExistsError, NotFoundError } from '@utils/errors';
import { GqlOffsetPagination } from '@common/pagination';
import { SortType } from '@common/sort';
import { FilterType } from '@common/filter';
import { parseArgsToQuery } from '@common/typeorm-query-parser';

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
    pagination?: GqlOffsetPagination,
    sort?: SortType<UserEntity>,
    filter?: FilterType<UserEntity>,
  ): Promise<PaginatedUsers> => {
    const qb = parseArgsToQuery(this.userRepository, pagination, sort, filter);
    const { entities: data } = await qb.getRawAndEntities();
    const count = await qb.getCount();

    return {
      edges: data,
      totalCount: count,
      hasNext: count > pagination.take + pagination.skip,
    };
  };

  readManyByIds = async (ids: string[]): Promise<UserEntity[]> =>
    await this.userRepository.findBy({ id: In(ids) });

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
    return this.userRepository.save({
      ...user,
      ...updateUserInput,
      isEmailConfirmed:
        updateUserInput.email && user.email !== updateUserInput.email
          ? false
          : user.isEmailConfirmed,
    });
  };

  setEmailConfirmed = async (id: string) => {
    await this.userRepository.update(id, { isEmailConfirmed: true });
  };

  delete = async (id: string): Promise<boolean> => {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundError(`User with id "${id}" not found!`);
    }
    await this.userRepository.remove(user);
    return true;
  };
}
