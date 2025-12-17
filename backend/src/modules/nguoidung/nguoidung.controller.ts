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
import { NguoiDungService } from './nguoidung.service';
import { CreateNguoidungDto } from './dto/create-nguoidung.dto';
import { UpdateNguoidungDto } from './dto/update-nguoidung.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { userAvatarStorage } from 'src/cloudinary/user.storage';

@Controller('nguoidung')
export class NguoiDungController {
  constructor(private readonly nguoiDungService: NguoiDungService) {}

  @Get()
  findAll() {
    return this.nguoiDungService.findAll();
  }

  @Get(':IdNguoiDung')
  findOne(@Param('IdNguoiDung') IdNguoiDung: string) {
    return this.nguoiDungService.findOne(Number(IdNguoiDung));
  }

  @Post()
  create(@Body() dto: CreateNguoidungDto) {
    return this.nguoiDungService.create(dto);
  }

  @Put(':IdNguoiDung')
  update(
    @Param('IdNguoiDung') IdNguoiDung: string,
    @Body() dto: UpdateNguoidungDto,
  ) {
    return this.nguoiDungService.update(Number(IdNguoiDung), dto);
  }

  @Delete(':IdNguoiDung')
  delete(@Param('IdNguoiDung') IdNguoiDung: string) {
    return this.nguoiDungService.delete(Number(IdNguoiDung));
  }

  @Post('upload/:IdNguoiDung')
  @UseInterceptors(FileInterceptor('image', { storage: userAvatarStorage }))
  uploadUserAvatar(
    @Param('IdNguoiDung') IdNguoiDung: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file);
    return this.nguoiDungService.updateImage(
      +IdNguoiDung,
      file.path,
      file.filename,
    );
  }
}
