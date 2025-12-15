import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMagiamgiaDto } from './dto/create-magiamgia.dto';
import { UpdateMagiamgiaDto } from './dto/update-magiamgia.dto';

@Injectable()
export class MaGiamGiaService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.tbl_magiamgia.findMany();
  }

  findOne(IdGiamGia: number) {
    return this.prisma.tbl_magiamgia.findUnique({
      where: { IdGiamGia },
    });
  }

  create(data: CreateMagiamgiaDto) {
    return this.prisma.tbl_magiamgia.create({
      data,
    });
  }

  update(IdGiamGia: number, data: UpdateMagiamgiaDto) {
    return this.prisma.tbl_magiamgia.update({
      where: { IdGiamGia },
      data,
    });
  }

  delete(IdGiamGia: number) {
    return this.prisma.tbl_magiamgia.delete({
      where: { IdGiamGia },
    });
  }
}
