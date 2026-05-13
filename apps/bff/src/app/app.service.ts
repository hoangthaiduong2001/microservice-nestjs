import { PORT } from '@common/constants/common.constant';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string } {
    console.log(PORT);

    return { message: 'Hello API' };
  }
}
