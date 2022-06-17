import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from '../../user/entities/user.model';

@Entity({ name: 'emails_confirmations' })
export class EmailConfirmationModel {
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
