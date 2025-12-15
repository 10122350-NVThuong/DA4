import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { DanhGiaService } from './danhgia.service';
import { CreateDanhgiasanphamDto } from './dto/create-danhgia.dto';
import { UpdateDanhgiasanphamDto } from './dto/update-danhgia.dto';
import { Auth } from 'src/common/decorators/auth.decorator';

@Controller('danhgia')
export class DanhGiaController {
  constructor(private readonly DanhGiaService: DanhGiaService) {}

  @Get()
  findAll() {
    return this.DanhGiaService.findAll();
  }

  @Get(':Id')
  findOne(@Param('Id') Id: string) {
    return this.DanhGiaService.findOne(Number(Id));
  }

  @Post()
  create(@Body() dto: CreateDanhgiasanphamDto) {
    return this.DanhGiaService.create(dto);
  }

  @Put(':Id')
  update(@Param('Id') Id: string, @Body() dto: UpdateDanhgiasanphamDto) {
    return this.DanhGiaService.update(Number(Id), dto);
  }

  @Delete(':Id')
  delete(@Param('Id') Id: string) {
    return this.DanhGiaService.delete(Number(Id));
  }
}
