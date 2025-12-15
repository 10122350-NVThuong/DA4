import { Module } from '@nestjs/common';
import { DonHangService } from './donhang.service';
import { DonHangController } from './donhang.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [DonHangController],
  providers: [DonHangService, PrismaService],
})
export class DonHangModule {}
