import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDanhgiasanphamDto } from './dto/create-danhgia.dto';
import { UpdateDanhgiasanphamDto } from './dto/update-danhgia.dto';

@Injectable()
export class DanhGiaService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.tbl_danhgiasanpham.findMany();
  }

  findOne(Id: number) {
    return this.prisma.tbl_danhgiasanpham.findUnique({
      where: { Id },
    });
  }

  create(data: CreateDanhgiasanphamDto) {
    return this.prisma.tbl_danhgiasanpham.create({
      data,
    });
  }

  update(Id: number, data: UpdateDanhgiasanphamDto) {
    return this.prisma.tbl_danhgiasanpham.update({
      where: { Id },
      data,
    });
  }

  delete(Id: number) {
    return this.prisma.tbl_danhgiasanpham.delete({
      where: { Id },
    });
  }
}
