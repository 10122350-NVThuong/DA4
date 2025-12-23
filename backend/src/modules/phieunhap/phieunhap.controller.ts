import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { PhieuNhapService } from './phieunhap.service';
import { CreatePhieunhapDto } from './dto/create-phieunhap.dto';
import { UpdatePhieunhapDto } from './dto/update-phieunhap.dto';

@Controller('phieunhap')
export class PhieuNhapController {
  constructor(private readonly phieunhapService: PhieuNhapService) {}

  @Get()
  findAll() {
    return this.phieunhapService.findAll();
  }

  @Get(':IdPhieuNhap')
  findOne(@Param('IdPhieuNhap', ParseIntPipe) IdPhieuNhap: number) {
    return this.phieunhapService.findOne(IdPhieuNhap);
  }

  @Post()
  create(@Body() dto: CreatePhieunhapDto) {
    return this.phieunhapService.create(dto);
  }

  @Put(':IdPhieuNhap')
  update(
    @Param('IdPhieuNhap', ParseIntPipe) IdPhieuNhap: number,
    @Body() dto: UpdatePhieunhapDto,
  ) {
    return this.phieunhapService.update(IdPhieuNhap, dto);
  }

  @Delete(':IdPhieuNhap')
  delete(@Param('IdPhieuNhap', ParseIntPipe) IdPhieuNhap: number) {
    return this.phieunhapService.delete(IdPhieuNhap);
  }

  @Patch(':IdPhieuNhap/duyet')
  duyet(@Param('IdPhieuNhap', ParseIntPipe) IdPhieuNhap: number) {
    return this.phieunhapService.duyetPhieuNhap(IdPhieuNhap);
  }
}
