import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, HideField, ID, Int, ObjectType } from '@nestjs/graphql';
import { RoleEnum } from '@utils/enums';
import { CountryEntity } from '../../country/entities/country.entity';
import { ImageEntity } from '../../image/entities/image.entity';
import { FilterableField } from '@common/filter';

@ObjectType()
@Entity({ name: 'users' })
export class UserEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @FilterableField()
  @Column({ unique: true })
  email: string;

  @FilterableField()
  @Column({ default: false })
  isEmailConfirmed: boolean;

  @HideField()
  @Column()
  password: string;

  @FilterableField()
  @Column()
  name: string;

  @FilterableField()
  @CreateDateColumn()
  createdAt: Date;

  @FilterableField()
  @UpdateDateColumn()
  updatedAt: Date;

  @FilterableField(() => RoleEnum)
  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.User })
  role: RoleEnum;

  @FilterableField(() => Int, { nullable: true })
  @Column({ nullable: true })
  countryId?: number;

  @Field(() => CountryEntity, { nullable: true })
  @ManyToOne(() => CountryEntity, { nullable: true })
  country?: CountryEntity;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  avatarId?: string;

  @Field(() => ImageEntity, { nullable: true })
  @ManyToOne(() => ImageEntity, { nullable: true })
  avatar?: ImageEntity;
}
