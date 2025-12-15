import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateChitietphieunhapDto } from './dto/create-chitietphieunhap.dto';
import { UpdateChitietphieunhapDto } from './dto/update-chitietphieunhap.dto';

@Injectable()
export class ChiTietPhieuNhapService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.tbl_chitietphieunhap.findMany();
  }

  findDetail(IdPhieuNhap: number) {
    return this.prisma.tbl_chitietphieunhap.findMany({
      where: { IdPhieuNhap },
    });
  }

  update(Id: number, data: UpdateChitietphieunhapDto) {
    return this.prisma.tbl_chitietphieunhap.update({
      where: { Id },
      data,
    });
  }

  delete(Id: number) {
    return this.prisma.tbl_chitietphieunhap.delete({
      where: { Id },
    });
  }
}
