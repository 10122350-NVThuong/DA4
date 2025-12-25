import { Module } from '@nestjs/common';
import { StatisticsService } from './thongke.service';
import { StatisticsController } from './thongke.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService, PrismaService],
})
export class StatisticsModule {}
