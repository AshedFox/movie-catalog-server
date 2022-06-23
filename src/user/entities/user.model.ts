import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { RoleEnum } from '../../shared/role.enum';

@ObjectType()
@Entity({ name: 'users' })
export class UserModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field()
  @Column({ default: false })
  isEmailConfirmed!: boolean;

  @Column()
  password!: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  @Field(() => RoleEnum)
  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.User })
  role!: RoleEnum;
}
