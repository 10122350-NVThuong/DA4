import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSanPhamDto } from './dto/create-sanpham.dto';
import { UpdateSanPhamDto } from './dto/update-sanpham.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class SanPhamService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  findAll() {
    return this.prisma.tbl_sanpham.findMany();
  }

  findOne(IdSanPham: number) {
    return this.prisma.tbl_sanpham.findUnique({
      where: { IdSanPham },
    });
  }

  create(dto: CreateSanPhamDto) {
    const { ParentID, ...data } = dto;

    return this.prisma.tbl_sanpham.create({
      data: {
        ...data,
        IdDanhMuc: data.IdDanhMuc || ParentID,
      },
    });
  }

  update(IdSanPham: number, dto: UpdateSanPhamDto) {
    const { ParentID, ...data } = dto;

    return this.prisma.tbl_sanpham.update({
      where: { IdSanPham },
      data: {
        ...data,
        IdDanhMuc: data.IdDanhMuc ?? ParentID,
      },
    });
  }

  delete(IdSanPham: number) {
    return this.prisma.tbl_sanpham.delete({
      where: { IdSanPham },
    });
  }

  async updateImage(IdSanPham: number, imageUrl: string, publicId: string) {
    return this.prisma.tbl_sanpham.update({
      where: { IdSanPham },
      data: {
        HinhAnh: imageUrl,
        CloudinaryId: publicId,
      },
    });
  }
}
