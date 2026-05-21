import { MetaDataKeys } from '@common/constants/common.constant';
import { getProcessId } from '@common/utils/string.util';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ProcessId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request[MetaDataKeys.PROCESS_ID] || getProcessId();
});
