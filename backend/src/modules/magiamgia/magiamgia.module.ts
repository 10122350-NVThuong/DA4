import { Module } from '@nestjs/common';
import { MaGiamGiaService } from './magiamgia.service';
import { MaGiamGiaController } from './magiamgia.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [MaGiamGiaController],
  providers: [MaGiamGiaService, PrismaService],
})
export class MaGiamGiaModule {}
