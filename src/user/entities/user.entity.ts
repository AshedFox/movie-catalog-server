import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, HideField, ID, Int, ObjectType } from '@nestjs/graphql';
import { RoleEnum } from '../../utils/enums/role.enum';
import { CountryEntity } from '../../country/entities/country.entity';
import { ImageEntity } from '../../image/entities/image.entity';

@ObjectType()
@Entity({ name: 'users' })
export class UserEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column({ default: false })
  isEmailConfirmed: boolean;

  @HideField()
  @Column()
  password: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => RoleEnum)
  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.User })
  role: RoleEnum;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  countryId?: number;

  @Field(() => CountryEntity, { nullable: true })
  @ManyToOne(() => CountryEntity, { nullable: true })
  country?: CountryEntity;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatarId?: string;

  @Field(() => ImageEntity, { nullable: true })
  @ManyToOne(() => ImageEntity, { nullable: true })
  avatar?: ImageEntity;
}
