import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { FileUpload } from 'graphql-upload';

@Injectable()
export class CloudinaryService {
  uploadImage = async (
    file: FileUpload,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> =>
    new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          unique_filename: true,
          eager: [{ format: 'jpg' }],
          resource_type: 'image',
          folder: 'movie-catalog/images',
        },
        (err, callResult) => {
          if (err) {
            return reject(err);
          }
          return resolve(callResult);
        },
      );

      file.createReadStream().pipe(upload);
    });

  uploadVideo = async (
    file: FileUpload,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> =>
    new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_chunked_stream(
        {
          unique_filename: true,
          eager: [{ format: 'mpd', streaming_profile: 'hd' }],
          eager_async: true,
          resource_type: 'video',
          folder: 'movie-catalog/videos',
        },
        (err, callResult) => {
          if (err) {
            return reject(err);
          }
          return resolve(callResult);
        },
      );

      file.createReadStream().pipe(upload);
    });
}
