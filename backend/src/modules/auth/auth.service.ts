import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

export const UserSessions = new Map<string, string>();
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.tbl_nguoidung.findFirst({
      where: { Email: email },
    });

    if (!user || !user.MatKhau || !password) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const isPasswordValid = await bcrypt.compare(password, user?.MatKhau);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const payload = {
      sub: user.IdNguoiDung,
      Email: user.Email,
      roles: user.VaiTro,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: user.IdNguoiDung,
        HoTen: user.HoTen,
        Email: user.Email,
        DiaChi: user.DiaChi,
        SoDienThoai: user.SoDienThoai,
        roles: user.VaiTro,
      },
    };
  }
}
