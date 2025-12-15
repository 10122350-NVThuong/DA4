import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { DanhMucService } from './danhmuc.service';
import { CreateDanhmucDto } from './dto/create-danhmuc.dto';
import { UpdateDanhmucDto } from './dto/update-danhmuc.dto';

@Controller('danhmuc')
export class DanhMucController {
  constructor(private readonly danhMucService: DanhMucService) {}

  @Get()
  findAll() {
    return this.danhMucService.findAll();
  }

  // ✅ GET DANH MỤC CHA
  @Get('danhmuccha')
  findDanhMucCha() {
    return this.danhMucService.findParentCategories();
  }

  @Get('child/:parentId')
  getChildCategories(@Param('parentId') parentId: string) {
    return this.danhMucService.findChildCategories(Number(parentId));
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.danhMucService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDanhmucDto) {
    return this.danhMucService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDanhmucDto) {
    return this.danhMucService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.danhMucService.delete(id);
  }
}
