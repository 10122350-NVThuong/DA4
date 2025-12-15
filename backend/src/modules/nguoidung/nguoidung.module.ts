import { Module } from '@nestjs/common';
import { NguoiDungService } from './nguoidung.service';
import { NguoiDungController } from './nguoidung.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [NguoiDungController],
  providers: [NguoiDungService, PrismaService],
})
export class NguoiDungModule {}
