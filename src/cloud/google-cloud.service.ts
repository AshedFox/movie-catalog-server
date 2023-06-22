import { Injectable } from '@nestjs/common';
import { Bucket, Storage } from '@google-cloud/storage';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as process from 'process';
import fs from 'fs';

@Injectable()
export class GoogleCloudService {
  private readonly storage: Storage;
  private readonly bucket: Bucket;

  constructor(private readonly configService: ConfigService) {
    this.storage = new Storage({
      projectId: configService.get('GCS_PROJECT_ID'),
      keyFilename: join(process.cwd(), 'gcs_credentials.json'),
    });
    this.bucket = this.storage.bucket(
      this.configService.get('GCS_MEDIA_BUCKET'),
    );
    this.bucket.setCorsConfiguration([
      {
        maxAgeSeconds: 3600,
        method: ['GET'],
        origin: ['*'],
        responseHeader: ['Content-Type'],
      },
    ]);
  }

  upload = async (
    inputPath: string,
    filePath: string,
    isPublic: boolean = true,
  ): Promise<string> => {
    const file = this.bucket.file(filePath);
    await pipeline(
      fs.createReadStream(inputPath),
      file.createWriteStream({ public: isPublic }),
    );

    return file.publicUrl().replace(/%2F/gi, '/');
  };

  uploadStream = async (
    inputStream: Readable,
    filePath: string,
    isPublic: boolean = true,
  ): Promise<string> => {
    const file = this.bucket.file(filePath);
    await pipeline(inputStream, file.createWriteStream({ public: isPublic }));
    return file.publicUrl().replace(/%2F/gi, '/');
  };

  delete = async (filePath: string): Promise<void> => {
    await this.bucket.file(filePath).delete();
  };
}
