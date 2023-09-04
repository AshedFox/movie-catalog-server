import { ContextType, ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
  ): Promise<boolean> {
    const reqType = context.getType<ContextType | 'graphql'>();

    if (
      reqType === 'graphql' &&
      !!GqlExecutionContext.create(context).getContext().extra
    ) {
      return true;
    }

    return super.handleRequest(context, limit, ttl);
  }

  getRequestResponse(context: ExecutionContext): {
    req: Record<string, any>;
    res: Record<string, any>;
  } {
    const reqType = context.getType<ContextType | 'graphql'>();
    if (reqType === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      const ctx = gqlCtx.getContext();
      return { req: ctx.req, res: ctx.res };
    } else if (reqType === 'http') {
      const http = context.switchToHttp();
      return { req: http.getRequest(), res: http.getResponse() };
    }
  }
}
