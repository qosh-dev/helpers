import { Injectable } from '@nestjs/common';
import * as qrcode from 'qrcode';
import { ConfigService } from '../../shared/config/config.service';
import { FileService } from '../../shared/file-service/file-service';

@Injectable()
export class QrCodeService extends FileService<string[]> {
  constructor(readonly config: ConfigService) {
    super({
      localStoredDir: config.dirs['qr-code'],
      remoteStoredPath: config.urls['qr-code'],
      extention: 'png'
    });
  }

  createBuffer(payload: string[]): Promise<Buffer> {
    const data = payload.join('\n');
    return qrcode.toBuffer(data);
  }
}
