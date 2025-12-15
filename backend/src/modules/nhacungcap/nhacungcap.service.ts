import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNhacungcapDto } from './dto/create-nhacungcap.dto';
import { UpdateNhacungcapDto } from './dto/update-nhacungcap.dto';

@Injectable()
export class NhaCungCapService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.tbl_nhacungcap.findMany();
  }

  findOne(IdNhaCungCap: number) {
    return this.prisma.tbl_nhacungcap.findUnique({
      where: { IdNhaCungCap },
    });
  }

  create(data: CreateNhacungcapDto) {
    return this.prisma.tbl_nhacungcap.create({
      data,
    });
  }

  update(IdNhaCungCap: number, data: UpdateNhacungcapDto) {
    return this.prisma.tbl_nhacungcap.update({
      where: { IdNhaCungCap },
      data,
    });
  }

  delete(IdNhaCungCap: number) {
    return this.prisma.tbl_nhacungcap.delete({
      where: { IdNhaCungCap },
    });
  }
}
