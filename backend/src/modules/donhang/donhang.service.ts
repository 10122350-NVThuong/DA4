import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDonhangDto } from './dto/create-donhang.dto';
import { UpdateDonhangDto } from './dto/update-donhang.dto';

@Injectable()
export class DonHangService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.tbl_donhang.findMany();
  }

  findOne(IdDonHang: number) {
    return this.prisma.tbl_donhang.findUnique({
      where: { IdDonHang },
    });
  }

  create(data: CreateDonhangDto) {
    return this.prisma.tbl_donhang.create({
      data,
    });
  }

  update(IdDonHang: number, data: UpdateDonhangDto) {
    return this.prisma.tbl_donhang.update({
      where: { IdDonHang },
      data,
    });
  }

  delete(IdDonHang: number) {
    return this.prisma.tbl_donhang.delete({
      where: { IdDonHang },
    });
  }
}
