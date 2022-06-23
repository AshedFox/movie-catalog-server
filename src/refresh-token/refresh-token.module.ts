import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenModel } from './entities/refresh-token.model';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshTokenModel])],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
