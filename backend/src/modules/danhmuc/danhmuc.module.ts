import { Module } from '@nestjs/common';
import { DanhMucService } from './danhmuc.service';
import { DanhMucController } from './danhmuc.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [DanhMucController],
  providers: [DanhMucService, PrismaService],
})
export class DanhMucModule {}
