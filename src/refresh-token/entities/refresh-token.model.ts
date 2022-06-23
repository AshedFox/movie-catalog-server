import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from '../../user/entities/user.model';

@Entity('refresh_tokens')
export class RefreshTokenModel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  expiresAt!: Date;

  @Column()
  userId!: string;

  @ManyToOne(() => UserModel)
  user!: UserModel;
}
