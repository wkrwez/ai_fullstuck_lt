import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { FileUploadService } from './upload.service';

@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('chunk')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/chunks', // 存储分块的目录
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}-${file.originalname}`); // 分块文件名可以加上时间戳等信息保证唯一性
        },
      }),
    }),
  )
  async uploadChunk(@UploadedFile() file, @Body() metaData) {
    // 将分块信息（如文件ID、当前分块编号、总分块数等）传递给服务层进行处理
    await this.fileUploadService.handleChunk(file, metaData);
    return { success: true };
  }
}
