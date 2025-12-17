import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGiohangDto } from './dto/create-giohang.dto';
import { UpdateGiohangDto } from './dto/update-giohang.dto';

@Injectable()
export class GioHangService {
  constructor(private prisma: PrismaService) {}

  findByUser(IdNguoiDung: number) {
    return this.prisma.tbl_giohang.findMany({
      where: { IdNguoiDung },
      include: {
        tbl_sanpham: true,
      },
    });
  }

  async create(dto: CreateGiohangDto) {
    const { IdNguoiDung, IdSanPham } = dto;

    const existed = await this.prisma.tbl_giohang.findFirst({
      where: {
        IdNguoiDung,
        IdSanPham,
      },
    });

    const soLuongMoi = (existed?.SoLuong ?? 0) + (dto.SoLuong ?? 0);

    if (existed) {
      return this.prisma.tbl_giohang.update({
        where: { Id: existed.Id },
        data: {
          SoLuong: soLuongMoi,
        },
        include: {
          tbl_sanpham: true,
        },
      });
    }

    return this.prisma.tbl_giohang.create({
      data: {
        IdNguoiDung,
        IdSanPham,
        SoLuong: dto.SoLuong ?? 1,
        GiaCa: dto.GiaCa,
      },
      include: {
        tbl_sanpham: true,
      },
    });
  }

  async updateQuantity(dto: UpdateGiohangDto) {
    return this.prisma.tbl_giohang.updateMany({
      where: {
        IdNguoiDung: dto.IdNguoiDung,
        IdSanPham: dto.IdSanPham,
      },
      data: {
        SoLuong: dto.SoLuong,
      },
    });
  }

  async deleteItem(Id: number) {
    return this.prisma.tbl_giohang.delete({
      where: {
        Id,
      },
    });
  }
}
