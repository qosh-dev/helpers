import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QrCodeService } from './qr-code.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [QrCodeService],
  exports: [QrCodeService]
})
export class QrCodeModule {}
