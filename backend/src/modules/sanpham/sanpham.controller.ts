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
import { SanPhamService } from './sanpham.service';
import { CreateSanPhamDto } from './dto/create-sanpham.dto';
import { UpdateSanPhamDto } from './dto/update-sanpham.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { productImageStorage } from 'src/cloudinary/product.storage';

@Controller('sanpham')
export class SanPhamController {
  constructor(private readonly sanPhamService: SanPhamService) {}

  @Get()
  @Auth()
  findAll() {
    return this.sanPhamService.findAll();
  }

  @Get(':IdSanPham')
  findOne(@Param('IdSanPham') id: string) {
    return this.sanPhamService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateSanPhamDto) {
    return this.sanPhamService.create(dto);
  }

  @Put(':IdSanPham')
  update(@Param('IdSanPham') id: string, @Body() dto: UpdateSanPhamDto) {
    return this.sanPhamService.update(+id, dto);
  }

  @Delete(':IdSanPham')
  delete(@Param('IdSanPham') id: string) {
    return this.sanPhamService.delete(+id);
  }

  @Post('upload/:IdSanPham')
  @UseInterceptors(FileInterceptor('image', { storage: productImageStorage }))
  uploadProductImage(
    @Param('IdSanPham') IdSanPham: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.sanPhamService.updateImage(
      +IdSanPham,
      file.path,
      file.filename,
    );
  }
}
