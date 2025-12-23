import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePhieunhapDto } from './dto/create-phieunhap.dto';
import { UpdatePhieunhapDto } from './dto/update-phieunhap.dto';
import { tbl_phieunhap_TrangThai } from '@prisma/client';

@Injectable()
export class PhieuNhapService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.tbl_phieunhap.findMany({
      include: {
        tbl_chitietphieunhap: {
          include: {
            tbl_sanpham: true,
          },
        },
        tbl_nhacungcap: true,
      },
      orderBy: {
        IdPhieuNhap: 'desc',
      },
    });
  }

  findOne(IdPhieuNhap: number) {
    return this.prisma.tbl_phieunhap.findUnique({
      where: { IdPhieuNhap },
      include: {
        tbl_chitietphieunhap: {
          include: {
            tbl_sanpham: true,
          },
        },
        tbl_nhacungcap: true,
      },
    });
  }

  async create(dto: CreatePhieunhapDto) {
    if (!dto.ChiTiet || dto.ChiTiet.length === 0) {
      throw new BadRequestException('Phiếu nhập phải có chi tiết');
    }

    const tongTien = dto.ChiTiet.reduce((sum, item) => {
      return sum + (item.GiaCa ?? 0) * (item.SoLuongNhap ?? 0);
    }, 0);

    return this.prisma.tbl_phieunhap.create({
      data: {
        IdNhaCungCap: dto.IdNhaCungCap,
        NguoiNhap: dto.NguoiNhap,
        NgayNhap: dto.NgayNhap ?? new Date(),
        TongTien: tongTien,
        TrangThai: dto.TrangThai ?? tbl_phieunhap_TrangThai.Cho_duyet,

        tbl_chitietphieunhap: {
          create: dto.ChiTiet.map((item) => ({
            IdSanPham: item.IdSanPham,
            GiaCa: item.GiaCa,
            SoLuongNhap: item.SoLuongNhap,
          })),
        },
      },
      include: {
        tbl_chitietphieunhap: true,
      },
    });
  }

  async update(IdPhieuNhap: number, dto: UpdatePhieunhapDto) {
    const phieuNhap = await this.prisma.tbl_phieunhap.findUnique({
      where: { IdPhieuNhap },
    });

    if (!phieuNhap) {
      throw new NotFoundException('Phiếu nhập không tồn tại');
    }

    if (phieuNhap.TrangThai !== tbl_phieunhap_TrangThai.Cho_duyet) {
      throw new BadRequestException(
        'Chỉ được sửa phiếu nhập ở trạng thái Chờ duyệt',
      );
    }

    return this.prisma.tbl_phieunhap.update({
      where: { IdPhieuNhap },
      data: {
        IdNhaCungCap: dto.IdNhaCungCap,
        NguoiNhap: dto.NguoiNhap,
        NgayNhap: dto.NgayNhap,
      },
    });
  }

  async delete(IdPhieuNhap: number) {
    return this.prisma.tbl_phieunhap.delete({
      where: { IdPhieuNhap },
    });
  }

  async duyetPhieuNhap(IdPhieuNhap: number) {
    return this.prisma.$transaction(async (tx) => {
      const phieuNhap = await tx.tbl_phieunhap.findUnique({
        where: { IdPhieuNhap },
        include: {
          tbl_chitietphieunhap: true,
        },
      });

      if (!phieuNhap) {
        throw new NotFoundException('Phiếu nhập không tồn tại');
      }

      if (phieuNhap.TrangThai !== tbl_phieunhap_TrangThai.Cho_duyet) {
        throw new BadRequestException('Phiếu nhập đã được xử lý');
      }

      for (const item of phieuNhap.tbl_chitietphieunhap) {
        if (!item.IdSanPham) {
          throw new BadRequestException('Chi tiết phiếu nhập thiếu IdSanPham');
        }

        const sanpham = await tx.tbl_sanpham.findUnique({
          where: { IdSanPham: item.IdSanPham },
        });

        if (!sanpham) {
          throw new BadRequestException(
            `Sản phẩm ${item.IdSanPham} không tồn tại`,
          );
        }

        const soLuongNhap = item.SoLuongNhap ?? 0;

        if (sanpham.SoLuongTon === null) {
          // Nếu muốn cho phép null → set về 0 trước
          await tx.tbl_sanpham.update({
            where: { IdSanPham: item.IdSanPham },
            data: {
              SoLuongTon: soLuongNhap,
            },
          });
        } else {
          await tx.tbl_sanpham.update({
            where: { IdSanPham: item.IdSanPham },
            data: {
              SoLuongTon: {
                increment: soLuongNhap,
              },
            },
          });
        }
      }

      return tx.tbl_phieunhap.update({
        where: { IdPhieuNhap },
        data: {
          TrangThai: tbl_phieunhap_TrangThai.Da_nhap_kho,
        },
      });
    });
  }
}
