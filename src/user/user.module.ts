import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './entities/user.model';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
