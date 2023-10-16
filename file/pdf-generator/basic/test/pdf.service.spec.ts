import { Test } from '@nestjs/testing';
import * as fs from 'fs';
import { ConfigModule } from '../../../shared/config/config.module';
import { ConfigService } from '../../../shared/config/config.service';
import { BaseUtils } from '../../../utils/base.utils';
import { PdfModule } from '../pdf.module';
import { PdfService } from '../pdf.service';

describe('PdfService', () => {
  let service: PdfService;
  let generatedFilePath: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule, PdfModule],
      providers: [PdfService, ConfigService]
    }).compile();

    service = module.get<PdfService>(PdfService);
  });

  afterEach(async () => {
    await BaseUtils.wait(1000);
  });

  it('should create and save PDF file', async () => {
    const fileName = 'test';
    await service.createFile(fileName, {
      templateName: 'transaction-receipt.hbs',
      data: {}
    });
    // Check file exists
    const filePath = service.getFilePath(fileName);
    const extention = filePath.substring(
      filePath.length - 3,
      filePath.length
    );
    expect(extention).toBe('pdf');
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
