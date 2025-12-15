import { Module } from '@nestjs/common';
import { NhaCungCapService } from './nhacungcap.service';
import { NhaCungCapController } from './nhacungcap.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [NhaCungCapController],
  providers: [NhaCungCapService, PrismaService],
})
export class NhaCungCapModule {}
