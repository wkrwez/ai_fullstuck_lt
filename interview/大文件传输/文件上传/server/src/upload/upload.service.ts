import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  async handleChunk(file, metaData) {
    const chunkPath = path.join(
      './uploads/chunks',
      `${metaData.identifier}-${metaData.chunkIndex}`,
    );

    // 将接收到的分块保存到指定位置
    await this.saveChunk(file.path, chunkPath);

    // 如果这是最后一个分块，则开始合并所有分块
    if (parseInt(metaData.chunkIndex) === parseInt(metaData.totalChunks) - 1) {
      await this.mergeChunks(
        metaData.identifier,
        parseInt(metaData.totalChunks),
      );
    }
  }

  private saveChunk(sourcePath: string, destinationPath: string) {
    return new Promise<void>((resolve, reject) => {
      const readStream = fs.createReadStream(sourcePath);
      const writeStream = fs.createWriteStream(destinationPath);

      readStream.on('error', reject);
      writeStream.on('error', reject);

      // When the end-of-stream is reached, close the write stream and resolve the promise.
      readStream.on('end', () => {
        writeStream.end();
        resolve();
      });

      // Pipe the readable stream to the writable stream.
      readStream.pipe(writeStream);
    });
  }

  async mergeChunks(identifier, totalChunks) {
    const writeStream = fs.createWriteStream(`./uploads/${identifier}.part`);

    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join('./uploads/chunks', `${identifier}-${i}`);

      try {
        const readStream = fs.createReadStream(chunkPath);
        await new Promise((resolve, reject) => {
          readStream
            .on('end', () => resolve)
            .on('error', reject)
            .pipe(writeStream, { end: false });
          readStream.on('end', () => fs.unlinkSync(chunkPath)); // 删除已合并的分块
        });
      } catch (error) {
        console.error(`Error merging chunk ${i}:`, error);
        throw error;
      }
    }

    writeStream.end();
    console.log('File merged successfully.');
  }
}
