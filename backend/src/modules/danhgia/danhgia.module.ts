import { Module } from '@nestjs/common';
import { DanhGiaService } from './danhgia.service';
import { DanhGiaController } from './danhgia.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [DanhGiaController],
  providers: [DanhGiaService, PrismaService],
})
export class DanhGiaModule {}
