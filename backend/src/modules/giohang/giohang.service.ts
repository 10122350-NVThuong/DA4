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

  create(dto: CreateGiohangDto) {
    return this.prisma.tbl_giohang.create({
      data: dto,
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

  async deleteItem(dto: UpdateGiohangDto) {
    return this.prisma.tbl_giohang.deleteMany({
      where: {
        IdNguoiDung: dto.IdNguoiDung,
        IdSanPham: dto.IdSanPham,
      },
    });
  }
}
