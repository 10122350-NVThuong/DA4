import { Module } from '@nestjs/common';
import { SanPhamService } from './sanpham.service';
import { SanPhamController } from './sanpham.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [SanPhamController],
  providers: [SanPhamService, PrismaService],
})
export class SanPhamModule {}
