import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { MovieEntity } from '../../movie/entities/movie.entity';

@Entity('movies_visits_stats')
export class MovieVisitStatsEntity {
  @PrimaryGeneratedColumn({ type: 'int8' })
  id: number;

  @Column('uuid')
  movieId: string;

  @ManyToOne(() => MovieEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  movie: Relation<MovieEntity>;

  @CreateDateColumn()
  createdAt: Date;
}
