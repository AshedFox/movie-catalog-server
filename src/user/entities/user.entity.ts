import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { RoleEnum } from '@utils/enums';
import { CountryEntity } from '../../country/entities/country.entity';
import { MediaEntity } from '../../media/entities/media.entity';
import { FilterableField } from '@common/filter';

@ObjectType('User')
@Entity('users')
export class UserEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @FilterableField()
  @Column({ unique: true, length: 320 })
  email: string;

  @FilterableField()
  @Column({ default: false })
  @Index()
  isEmailConfirmed: boolean;

  @HideField()
  @Column()
  password: string;

  @FilterableField()
  @Column({ length: 255 })
  name: string;

  @FilterableField()
  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @FilterableField()
  @UpdateDateColumn()
  @Index()
  updatedAt: Date;

  @FilterableField(() => RoleEnum)
  @Column({
    type: 'enum',
    enum: RoleEnum,
    enumName: 'role_enum',
    default: RoleEnum.User,
  })
  @Index({ where: "role = 'user'" })
  role: RoleEnum;

  @FilterableField({ nullable: true })
  @Column({ nullable: true, type: 'char', length: 2 })
  @Index({ where: 'country_id IS NOT NULL' })
  countryId?: string;

  @Field(() => CountryEntity, { nullable: true })
  @ManyToOne(() => CountryEntity, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  country?: CountryEntity;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  @Index({ where: 'avatar_id IS NOT NULL' })
  avatarId?: number;

  @Field(() => MediaEntity, { nullable: true })
  @ManyToOne(() => MediaEntity, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  avatar?: MediaEntity;
}
