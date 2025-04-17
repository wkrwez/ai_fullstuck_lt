import { Module } from '@nestjs/common';
import { FileUploadController } from './upload.controller';
import { FileUploadService } from './upload.service';

@Module({
  imports: [],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class UploadModule {}
