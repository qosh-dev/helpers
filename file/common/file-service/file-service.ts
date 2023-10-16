import { Logger } from '@nestjs/common';
import * as fsPromise from 'fs/promises';
import * as path from 'path';
import { FileServiceError } from './file-service.common';
import { FileCreatePayload, FileServiceInitType } from './file-service.type';

/**
 * Helper class to create, store and retrive file
 */
export abstract class FileService<P> {
  constructor(private readonly options: FileServiceInitType) {
    if (options.isReplaceable === undefined) {
      options.isReplaceable = true;
    }
  }

  abstract createBuffer(payload: P): Promise<Buffer>;

  async createFile(
    fileName: string,
    {
      isReplaceable = this.options.isReplaceable,
      ...payload
    }: FileCreatePayload<P>
  ): Promise<void> {
    this.validateFileName(fileName);
    const isFileExist = await this.isFileExist(this.getFilePath(fileName));
    if (!isReplaceable && isFileExist) {
      Logger.log('File already exist SKIP');
      return;
    }
    const buffer = await this.createBuffer(payload as P);
    await this.saveFile(fileName, buffer);
  }

  async saveFile(fileName: string, buffer: Buffer): Promise<void> {
    this.validateFileName(fileName);
    const filePath = this.getFilePath(fileName);
    await fsPromise.writeFile(filePath, buffer);
  }

  async isFileExist(filePath: string) {
    try {
      await fsPromise.access(filePath, fsPromise.constants.F_OK);
      return true;
    } catch (error) {
      return false;
    }
  }

  getFilePath(fileName: string): string {
    const { localStoredDir, fileExtention } = this.options;
    this.validateFileName(fileName);
    return path.join(localStoredDir, `${fileName}.${fileExtention}`);
  }

  /**
   * @example http://localhost:3001/gnn/pdf/EE6A_1697128482673_2_136A551A9E.pdf
   */
  getFilePublicPath(fileName: string): string {
    const { remoteStoredPath, fileExtention } = this.options;
    this.validateFileName(fileName);
    return remoteStoredPath + `/${fileName}.${fileExtention}`;
  }

  /**
   * Used on returning buffer in http response
   * caller will get file
   */
  getFileHeaders(
    fileName: string,
    buffer: Buffer
  ): { [n in string]: number | string } {
    const { fileExtention } = this.options;
    this.validateFileName(fileName);
    return {
      'Content-Type': `application/${fileExtention}`,
      'Content-Disposition': `attachment; filename=${fileName}.${fileExtention}`,
      'Content-Length': buffer.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0
    };
  }

  /**
   * @throws
   */
  async deleteFile(filePath: string): Promise<void> {
    const isFileExist = await this.isFileExist(filePath);
    if (isFileExist) {
      await fsPromise.unlink(filePath);
    } else {
      throw new Error(FileServiceError.FILE_NOT_FOUND);
    }
  }

  // ------------------------------------------------------------------------------------

  validateFileName(fileName: string) {
    if (!fileName || fileName.endsWith(`.${this.options.fileExtention}`)) {
      throw new Error(FileServiceError.INVALID_FILE_NAME);
    }
  }
}
