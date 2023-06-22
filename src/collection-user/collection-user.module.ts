import { forwardRef, Module } from '@nestjs/common';
import { CollectionUserService } from './collection-user.service';
import { CollectionUserResolver } from './collection-user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionUserEntity } from './entities/collection-user.entity';
import { CollectionModule } from '../collection/collection.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CollectionUserEntity]),
    forwardRef(() => CollectionModule),
    forwardRef(() => UserModule),
  ],
  providers: [CollectionUserResolver, CollectionUserService],
  exports: [CollectionUserService],
})
export class CollectionUserModule {}
