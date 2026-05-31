import { INVOICE_STATUS } from '@common/constants/enum/invoice.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponseDto } from '../common/base-response.dto';

class ClientResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  address: string;
}

class ItemResponseDto {
  @ApiProperty({ type: String })
  productId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  vatRate: number;

  @ApiProperty()
  total: number;
}

export class InvoiceResponseDto extends BaseResponseDto {
  @ApiProperty({ type: ClientResponseDto })
  client: ClientResponseDto;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  vatAmount: number;

  @ApiProperty({ type: String, default: INVOICE_STATUS })
  status: INVOICE_STATUS;

  @ApiPropertyOptional({ type: String })
  supervisorId?: string;

  @ApiPropertyOptional()
  fileUrl?: string;
}
