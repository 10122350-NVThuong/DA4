import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDonhangDto } from './dto/create-donhang.dto';
import { UpdateDonhangDto } from './dto/update-donhang.dto';

@Injectable()
export class DonHangService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.tbl_donhang.findMany({
      orderBy: { NgayDat: 'desc' },
      include: {
        tbl_chitietdonhang: {
          include: { tbl_sanpham: true },
        },
      },
    });
  }

  async findOne(IdDonHang: number) {
    const donhang = await this.prisma.tbl_donhang.findUnique({
      where: { IdDonHang },
      include: {
        tbl_chitietdonhang: {
          include: { tbl_sanpham: true },
        },
      },
    });

    if (!donhang) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    return donhang;
  }

  findByUser(IdNguoiDung: number) {
    return this.prisma.tbl_donhang.findMany({
      where: { IdNguoiDung },
      orderBy: { NgayDat: 'desc' },
      include: {
        tbl_chitietdonhang: {
          include: { tbl_sanpham: true },
        },
      },
    });
  }

  async create(data: CreateDonhangDto) {
    const { ChiTiet, ...donhangData } = data;

    if (!ChiTiet || ChiTiet.length === 0) {
      throw new BadRequestException('Đơn hàng phải có ít nhất 1 sản phẩm');
    }

    return this.prisma.$transaction(async (tx) => {
      const donhang = await tx.tbl_donhang.create({
        data: donhangData,
      });

      for (const item of ChiTiet) {
        const sanpham = await tx.tbl_sanpham.findUnique({
          where: { IdSanPham: item.IdSanPham },
        });

        if (!sanpham) {
          throw new BadRequestException(
            `Sản phẩm ${item.IdSanPham} không tồn tại`,
          );
        }

        if (sanpham.SoLuongTon === null) {
          throw new BadRequestException(
            `Sản phẩm ${sanpham.TenSanPham} chưa thiết lập số lượng tồn`,
          );
        }

        if (sanpham.SoLuongTon < item.SoLuongDat) {
          throw new BadRequestException(
            `Sản phẩm ${sanpham.TenSanPham} không đủ số lượng`,
          );
        }

        await tx.tbl_chitietdonhang.create({
          data: {
            IdDonHang: donhang.IdDonHang,
            IdSanPham: item.IdSanPham,
            GiaCa: item.GiaCa,
            SoLuongDat: item.SoLuongDat,
          },
        });

        await tx.tbl_sanpham.update({
          where: { IdSanPham: item.IdSanPham },
          data: {
            SoLuongTon: {
              decrement: item.SoLuongDat,
            },
          },
        });
      }

      return tx.tbl_donhang.findUnique({
        where: { IdDonHang: donhang.IdDonHang },
        include: {
          tbl_chitietdonhang: {
            include: { tbl_sanpham: true },
          },
        },
      });
    });
  }

  async update(IdDonHang: number, data: UpdateDonhangDto) {
    const donhang = await this.prisma.tbl_donhang.findUnique({
      where: { IdDonHang },
    });

    if (!donhang) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    const { TrangThai } = data;

    return this.prisma.tbl_donhang.update({
      where: { IdDonHang },
      data: {
        TrangThai,
      },
    });
  }

  async delete(IdDonHang: number) {
    const donhang = await this.prisma.tbl_donhang.findUnique({
      where: { IdDonHang },
    });

    if (!donhang) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    return this.prisma.tbl_donhang.delete({
      where: { IdDonHang },
    });
  }
}
