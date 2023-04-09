import { Global, Module } from '@nestjs/common';
import { DataLoaderFactory } from './data-loader.factory';

@Global()
@Module({
  providers: [DataLoaderFactory],
  exports: [DataLoaderFactory],
})
export class DataLoaderModule {}
