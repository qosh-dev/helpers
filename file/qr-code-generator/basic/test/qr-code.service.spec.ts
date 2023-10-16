import { Test } from '@nestjs/testing';
import * as fs from 'fs';
import { ConfigModule } from '../../../shared/config/config.module';
import { ConfigService } from '../../../shared/config/config.service';
import { BaseUtils } from '../../../utils/base.utils';
import { QrCodeModule } from '../qr-code.module';
import { QrCodeService } from '../qr-code.service';

describe('QrCodeService', () => {
  let service: QrCodeService;
  let generatedFilePath: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule, QrCodeModule],
      providers: [QrCodeService, ConfigService]
    }).compile();

    service = module.get<QrCodeService>(QrCodeService);
  });

  afterEach(async () => {
    await BaseUtils.wait(1000);
  });

  it('should create and save Qr-code file', async () => {
    const fileName = 'test';
    await service.createFile(fileName, ['test', '1234']);
    // Check file exists
    const filePath = service.getFilePath(fileName);
    const extention = filePath.substring(
      filePath.length - 3,
      filePath.length
    );
    expect(extention).toBe('png');
    const isFileExist = fs.existsSync(filePath);
    expect(isFileExist).toBe(true);
    generatedFilePath = filePath;
  });

  it('should delete generated file', async () => {
    if (fs.existsSync(generatedFilePath)) {
      fs.unlinkSync(generatedFilePath);
    }
    const isFileExist = fs.existsSync(generatedFilePath);
    expect(isFileExist).toBe(false);
  });
});
