import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { MaGiamGiaService } from './magiamgia.service';
import { CreateMagiamgiaDto } from './dto/create-magiamgia.dto';
import { UpdateMagiamgiaDto } from './dto/update-magiamgia.dto';
import { Auth } from 'src/common/decorators/auth.decorator';

@Controller('magiamgia')
export class MaGiamGiaController {
  constructor(private readonly maGiamGiaService: MaGiamGiaService) {}

  @Get()
  @Auth()
  findAll() {
    return this.maGiamGiaService.findAll();
  }

  @Get(':IdGiamGia')
  findOne(@Param('IdGiamGia') IdGiamGia: string) {
    return this.maGiamGiaService.findOne(Number(IdGiamGia));
  }

  @Post()
  create(@Body() dto: CreateMagiamgiaDto) {
    return this.maGiamGiaService.create(dto);
  }

  @Put(':IdGiamGia')
  update(
    @Param('IdGiamGia') IdGiamGia: string,
    @Body() dto: UpdateMagiamgiaDto,
  ) {
    return this.maGiamGiaService.update(Number(IdGiamGia), dto);
  }

  @Delete(':IdGiamGia')
  delete(@Param('IdGiamGia') IdGiamGia: string) {
    return this.maGiamGiaService.delete(Number(IdGiamGia));
  }
}
