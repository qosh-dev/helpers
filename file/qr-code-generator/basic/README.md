# Required node modules

  qrcode

# Using example

<code>

constructor(
  private readonly qrCodeService: QrCodeService
) {}

await this.qrCodeService.createFile(fileName, data);
    
</code>