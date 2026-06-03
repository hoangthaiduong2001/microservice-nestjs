import { TCP_SERVICES } from '@common/configuration/lib/tcp.config';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { ProcessId } from '@common/decorators/processId.decorator';
import { CreateProductRequestDto, ProductResponseDto } from '@common/interfaces/gateway/product';

import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { map } from 'rxjs';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(@Inject(TCP_SERVICES.PRODUCT_SERVICE) private readonly productClient: TcpClient) {}

  @Post()
  @ApiResponse({ type: ResponseDto<ProductResponseDto> })
  @ApiOperation({ summary: 'Create a new product' })
  create(@Body() body: CreateProductRequestDto, @ProcessId() processId: string) {
    return this.productClient
      .send<ProductResponseDto, CreateProductRequestDto>(TCP_REQUEST_MESSAGE.PRODUCT.CREATE, { data: body, processId })
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Get()
  @ApiResponse({ type: ResponseDto<ProductResponseDto[]> })
  @ApiOperation({ summary: 'Create list product' })
  getList(@ProcessId() processId: string) {
    return this.productClient
      .send<ProductResponseDto[]>(TCP_REQUEST_MESSAGE.PRODUCT.GET_LIST, { processId })
      .pipe(map((data) => new ResponseDto(data)));
  }
}
