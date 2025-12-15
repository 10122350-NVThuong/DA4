import { Module } from '@nestjs/common';
import { PhieuNhapService } from './phieunhap.service';
import { PhieuNhapController } from './phieunhap.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PhieuNhapController],
  providers: [PhieuNhapService, PrismaService],
})
export class PhieuNhapModule {}
