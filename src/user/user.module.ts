import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CaslModule } from '../casl/casl.module';
import { MediaModule } from '../media/media.module';
import { StripeModule } from '../stripe/stripe.module';
import { CloudModule } from '../cloud/cloud.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    CaslModule,
    MediaModule,
    StripeModule,
    CloudModule,
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
