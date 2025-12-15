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

    const employee = await this.prisma.tbl_nguoidung.findFirst({
      where: { Email: email },
    });

    if (!employee || !employee.MatKhau || !password) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const isPasswordValid = await bcrypt.compare(password, employee?.MatKhau);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const payload = {
      sub: employee.IdNguoiDung,
      Email: employee.Email,
      roles: employee.VaiTro,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: employee.IdNguoiDung,
        HoTen: employee.HoTen,
        Email: employee.Email,
        roles: employee.VaiTro,
      },
    };
  }
}
