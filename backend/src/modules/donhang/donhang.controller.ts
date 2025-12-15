import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { DonHangService } from './donhang.service';
import { CreateDonhangDto } from './dto/create-donhang.dto';
import { UpdateDonhangDto } from './dto/update-donhang.dto';
import { Auth } from 'src/common/decorators/auth.decorator';

@Controller('donhang')
export class DonHangController {
  constructor(private readonly DonHangService: DonHangService) {}

  @Get()
  @Auth('Admin')
  findAll() {
    return this.DonHangService.findAll();
  }

  @Get(':IdDonHang')
  findOne(@Param('IdDonHang') IdDonHang: string) {
    return this.DonHangService.findOne(Number(IdDonHang));
  }

  @Post()
  create(@Body() dto: CreateDonhangDto) {
    return this.DonHangService.create(dto);
  }

  @Put(':IdDonHang')
  update(@Param('IdDonHang') IdDonHang: string, @Body() dto: UpdateDonhangDto) {
    return this.DonHangService.update(Number(IdDonHang), dto);
  }

  @Delete(':IdDonHang')
  delete(@Param('IdDonHang') IdDonHang: string) {
    return this.DonHangService.delete(Number(IdDonHang));
  }
}
