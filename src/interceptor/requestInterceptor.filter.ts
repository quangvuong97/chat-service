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

/**
 * @Injectable()
 * @description Interceptor xử lý các request đến server.
 * Thực hiện các tác vụ như: ghi log request, thiết lập ngữ cảnh người dùng,
 * và định dạng response trả về cho client một cách nhất quán.
 * Hoạt động như một middleware trong luồng xử lý request-response.
 */
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
      // Use AsyncLocalStorage to store and pass user context to all requests
      // through all middleware and services in the request processing flow.
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
