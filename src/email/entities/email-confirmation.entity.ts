import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({ name: 'emails_confirmations' })
export class EmailConfirmationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 320 })
  email: string;

  @Column({ type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  user: UserEntity;

  @Column()
  expiredAt: Date;
}
