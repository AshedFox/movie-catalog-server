import { Module } from '@nestjs/common';
import { SubtitlesService } from './subtitles.service';
import { SubtitlesResolver } from './subtitles.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubtitlesEntity } from './entities/subtitles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubtitlesEntity])],
  providers: [SubtitlesResolver, SubtitlesService],
  exports: [SubtitlesService],
})
export class SubtitlesModule {}
