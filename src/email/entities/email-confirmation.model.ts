import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserModel } from '../../user/entities/user.model';

@Entity()
export class EmailConfirmationModel extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => UserModel)
  user!: UserModel;

  @Column()
  expiredAt!: Date;
}
