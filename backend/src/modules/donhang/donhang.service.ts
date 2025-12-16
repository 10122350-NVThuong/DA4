import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDonhangDto } from './dto/create-donhang.dto';
import { UpdateDonhangDto } from './dto/update-donhang.dto';

@Injectable()
export class DonHangService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.tbl_donhang.findMany({
      orderBy: { NgayDat: 'desc' },
    });
  }

  findOne(IdDonHang: number) {
    return this.prisma.tbl_donhang.findUnique({
      where: { IdDonHang },
      include: {
        tbl_chitietdonhang: {
          include: {
            tbl_sanpham: true,
          },
        },
      },
    });
  }

  findByUser(IdNguoiDung: number) {
    return this.prisma.tbl_donhang.findMany({
      where: { IdNguoiDung },
      include: {
        tbl_chitietdonhang: {
          include: {
            tbl_sanpham: true,
          },
        },
      },
    });
  }

  create(data: CreateDonhangDto) {
    const { ChiTiet, ...donhangData } = data;

    return this.prisma.tbl_donhang.create({
      data: {
        ...donhangData,

        tbl_chitietdonhang: {
          create: ChiTiet.map((item) => ({
            GiaCa: item.GiaCa,
            SoLuongDat: item.SoLuongDat,

            tbl_sanpham: {
              connect: {
                IdSanPham: item.IdSanPham,
              },
            },
          })),
        },
      },
      include: {
        tbl_chitietdonhang: {
          include: {
            tbl_sanpham: true,
          },
        },
      },
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
