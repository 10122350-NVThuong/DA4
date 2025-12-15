import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async delete(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }
}
