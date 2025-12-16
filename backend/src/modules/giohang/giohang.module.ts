import { Module } from '@nestjs/common';
import { GioHangService } from './giohang.service';
import { GioHangController } from './giohang.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [GioHangController],
  providers: [GioHangService, PrismaService],
})
export class GioHangModule {}
