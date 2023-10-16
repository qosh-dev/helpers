import { Global, Module } from '@nestjs/common';
import { PdfService } from './pdf.service';

@Global()
@Module({
  providers: [PdfService],
  exports: [PdfService]
})
export class PdfModule {}
