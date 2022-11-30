import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  entities: ['dist/**/*.entity{.js,.ts}'],
  migrations: ['migrations/*{.js,.ts}'],
  url: process.env.CONNECTION_STRING,
  namingStrategy: new SnakeNamingStrategy(),
});

export default dataSource;
