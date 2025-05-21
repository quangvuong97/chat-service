import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Observable, map } from 'rxjs';
import { UserContext } from 'src/common/asyncLocalStorage/userContext';
import { SuccessResponse } from 'src/common/exceptions/successRequest.response';
import { JwtPayload } from 'src/guards/jwt/jwt.type';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  constructor(private readonly als: AsyncLocalStorage<UserContext>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // Code to run before handling the event
    const logger = new Logger();
    const request = context.switchToHttp().getRequest();
    const { user }: { user: JwtPayload } = request;
    // log request
    logger.log({
      message: `${request.method} ${request.originalUrl}`,
      payload: JSON.stringify({
        query: request.query,
        body: request.body,
        params: request.params,
      }),
      context: context.getClass().name,
    });
    // set user context
    const userContext = new UserContext(user);
    return new Observable((subscriber) => {
      // add user context to async local storage
      const subscription = this.als.run(userContext, () => {
        return next
          .handle()
          .pipe(
            map((data) => {
              // format response
              if (data instanceof SuccessResponse) return data;
              return new SuccessResponse({ data: data || null });
            }),
          )
          .subscribe(subscriber);
      });
      return () => subscription.unsubscribe();
    });
  }
}
