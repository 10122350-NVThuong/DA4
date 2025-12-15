import { Module } from '@nestjs/common';
import { ChiTietPhieuNhapService } from './chitietphieunhap.service';
import { ChiTietPhieuNhapController } from './chitietphieunhap.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ChiTietPhieuNhapController],
  providers: [ChiTietPhieuNhapService, PrismaService],
})
export class ChiTietPhieuNhapModule {}
