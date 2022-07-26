import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, HideField, ID, Int, ObjectType } from '@nestjs/graphql';
import { RoleEnum } from './role.enum';
import { CountryModel } from '../../country/entities/country.model';
import { ImageModel } from '../../image/entities/image.model';

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

  @HideField()
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

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  countryId?: number;

  @Field(() => CountryModel, { nullable: true })
  @ManyToOne(() => CountryModel, { nullable: true })
  country?: CountryModel;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatarId?: string;

  @Field(() => ImageModel, { nullable: true })
  @ManyToOne(() => ImageModel, { nullable: true })
  avatar?: ImageModel;
}
