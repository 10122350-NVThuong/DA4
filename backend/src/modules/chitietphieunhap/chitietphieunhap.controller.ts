import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ChiTietPhieuNhapService } from './chitietphieunhap.service';
import { UpdateChitietphieunhapDto } from './dto/update-chitietphieunhap.dto';
import { Auth } from 'src/common/decorators/auth.decorator';

@Controller('chitietphieunhap')
export class ChiTietPhieuNhapController {
  constructor(
    private readonly ChiTietPhieuNhapService: ChiTietPhieuNhapService,
  ) {}

  @Get()
  findAll() {
    return this.ChiTietPhieuNhapService.findAll();
  }

  @Get(':IdPhieuNhap')
  findDetail(@Param('IdPhieuNhap') IdPhieuNhap: string) {
    return this.ChiTietPhieuNhapService.findDetail(Number(IdPhieuNhap));
  }

  @Put(':Id')
  update(@Param('Id') Id: string, @Body() dto: UpdateChitietphieunhapDto) {
    return this.ChiTietPhieuNhapService.update(Number(Id), dto);
  }

  @Delete(':Id')
  delete(@Param('Id') Id: string) {
    return this.ChiTietPhieuNhapService.delete(Number(Id));
  }
}
