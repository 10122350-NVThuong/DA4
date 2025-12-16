import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

export const userAvatarStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'users',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 800, crop: 'limit' },
      { quality: 'auto' },
    ],
  }),
});
