import { Injectable } from '@nestjs/common';
import { Bucket, Storage } from '@google-cloud/storage';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { ConfigService } from '@nestjs/config';
import fs from 'fs';
import ms from 'ms';

@Injectable()
export class GoogleCloudService {
  private readonly storage: Storage;
  private readonly bucket: Bucket;

  constructor(private readonly configService: ConfigService) {
    this.storage = new Storage({
      projectId: configService.get('GCS_PROJECT_ID'),
      credentials: JSON.parse(configService.get('GCS_CREDENTIALS')),
    });
    this.bucket = this.storage.bucket(
      this.configService.get('GCS_MEDIA_BUCKET'),
    );
    this.bucket.setCorsConfiguration([
      {
        maxAgeSeconds: 3600,
        method: ['PUT', 'GET', 'HEAD', 'DELETE', 'POST', 'OPTIONS'],
        origin: ['*'],
        responseHeader: [
          'Content-Type',
          'Access-Control-Allow-Origin',
          'x-goog-resumable',
        ],
      },
    ]);
  }

  createFileUrls = async (
    path: string,
    type?: string,
  ): Promise<{
    uploadUrl: string;
    publicUrl: string;
  }> => {
    const file = this.bucket.file(path);

    return {
      uploadUrl: (
        await file.getSignedUrl({
          version: 'v4',
          expires: Date.now() + ms('1d'),
          action: 'write',
          contentType: type || 'application/octet-stream',
          responseDisposition: 'inline',
        })
      )[0],
      publicUrl: file.publicUrl().replace(/%2F/gi, '/'),
    };
  };

  upload = async (
    inputPath: string,
    filePath: string,
    isPublic = true,
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
    isPublic = true,
    type?: string,
  ): Promise<string> => {
    const file = this.bucket.file(filePath);
    await pipeline(
      inputStream,
      file.createWriteStream({
        public: isPublic,
        resumable: false,
        metadata: {
          contentType: type || 'application/octet-stream',
          contentDisposition: 'inline',
        },
      }),
    );
    return file.publicUrl().replace(/%2F/gi, '/');
  };

  delete = async (filePath: string): Promise<void> => {
    await this.bucket.file(filePath).delete();
  };
}
