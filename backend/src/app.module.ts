import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SanPhamModule } from './modules/sanpham/sanpham.module';
import { PhieuNhapModule } from './modules/phieunhap/phieunhap.module';
import { DanhMucModule } from './modules/danhmuc/danhmuc.module';
import { NguoiDungModule } from './modules/nguoidung/nguoidung.module';
import { AuthModule } from './modules/auth/auth.module';
import { GioHangModule } from './modules/giohang/giohang.module';
import { DonHangModule } from './modules/donhang/donhang.module';

@Module({
  imports: [
    SanPhamModule,
    PhieuNhapModule,
    DanhMucModule,
    NguoiDungModule,
    DonHangModule,
    PhieuNhapModule,
    AuthModule,
    GioHangModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
