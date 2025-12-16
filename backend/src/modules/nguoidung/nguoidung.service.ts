import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNguoidungDto } from './dto/create-nguoidung.dto';
import { UpdateNguoidungDto } from './dto/update-nguoidung.dto';
import * as bcrypt from 'bcrypt';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class NguoiDungService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async findAll() {
    const users = await this.prisma.tbl_nguoidung.findMany();
    return users.map((u) => this.excludePassword(u));
  }

  async findOne(IdNguoiDung: number) {
    const user = await this.prisma.tbl_nguoidung.findUnique({
      where: { IdNguoiDung },
    });

    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    return this.excludePassword(user);
  }

  async create(data: CreateNguoidungDto) {
    const hashed = await bcrypt.hash(data.MatKhau, 10);

    const user = await this.prisma.tbl_nguoidung.create({
      data: {
        ...data,
        MatKhau: hashed,
      },
    });

    return this.excludePassword(user);
  }

  async update(IdNguoiDung: number, data: UpdateNguoidungDto) {
    if (data.MatKhau) {
      data.MatKhau = await bcrypt.hash(data.MatKhau, 10);
    }

    const user = await this.prisma.tbl_nguoidung.update({
      where: { IdNguoiDung },
      data,
    });

    return this.excludePassword(user);
  }

  async delete(IdNguoiDung: number) {
    const user = await this.prisma.tbl_nguoidung.delete({
      where: { IdNguoiDung },
    });

    return {
      message: 'Xóa thành công',
      user: this.excludePassword(user),
    };
  }
  private excludePassword(user: any) {
    const { MatKhau, ...rest } = user;
    return rest;
  }

  async updateImage(IdNguoiDung: number, imageUrl: string, publicId: string) {
    return this.prisma.tbl_nguoidung.update({
      where: { IdNguoiDung },
      data: {
        Avatar: imageUrl,
        CloudinaryId: publicId,
      },
    });
  }
}
