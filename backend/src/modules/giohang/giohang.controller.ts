import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { GioHangService } from './giohang.service';
import { CreateGiohangDto } from './dto/create-giohang.dto';
import { UpdateGiohangDto } from './dto/update-giohang.dto';

@Controller('giohang')
export class GioHangController {
  constructor(private readonly giohangService: GioHangService) {}

  @Get(':IdNguoiDung')
  findByUser(@Param('IdNguoiDung') id: string) {
    return this.giohangService.findByUser(+id);
  }

  @Post()
  create(@Body() dto: CreateGiohangDto) {
    return this.giohangService.create(dto);
  }

  @Put('update')
  updateQuantity(@Body() dto: UpdateGiohangDto) {
    return this.giohangService.updateQuantity(dto);
  }

  @Delete(':id')
  deleteItem(@Param('id') id: string) {
    return this.giohangService.deleteItem(Number(id));
  }
}
