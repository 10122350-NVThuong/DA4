import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDanhmucDto } from './dto/create-danhmuc.dto';
import { UpdateDanhmucDto } from './dto/update-danhmuc.dto';

@Injectable()
export class DanhMucService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.tbl_danhmuc.findMany();
  }

  findOne(IdDanhMuc: number) {
    return this.prisma.tbl_danhmuc.findUnique({
      where: { IdDanhMuc },
    });
  }

  findParentCategories() {
    return this.prisma.tbl_danhmuc.findMany({
      where: {
        ParentID: null,
      },
      orderBy: {
        TenDanhMuc: 'asc',
      },
    });
  }

  findChildCategories(parentId: number) {
    return this.prisma.tbl_danhmuc.findMany({
      where: { ParentID: parentId },
      orderBy: { TenDanhMuc: 'asc' },
    });
  }

  create(data: CreateDanhmucDto) {
    return this.prisma.tbl_danhmuc.create({ data });
  }

  update(IdDanhMuc: number, data: UpdateDanhmucDto) {
    return this.prisma.tbl_danhmuc.update({
      where: { IdDanhMuc },
      data,
    });
  }

  delete(IdDanhMuc: number) {
    return this.prisma.tbl_danhmuc.delete({
      where: { IdDanhMuc },
    });
  }
}
