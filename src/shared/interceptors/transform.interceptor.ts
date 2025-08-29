import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((payload) => {
        // If handler returns { data, meta }, nest them under data: { items, meta }
        if (
          payload &&
          typeof payload === 'object' &&
          'data' in payload &&
          'meta' in payload
        ) {
          const { data, meta } = payload as { data: unknown; meta: unknown };
          return {
            success: true,
            message: 'Operation completed successfully',
            data: { items: data, meta } as unknown as T,
            timestamp: new Date().toISOString(),
          } as Response<T>;
        }

        return {
          success: true,
          message: 'Operation completed successfully',
          data: payload as T,
          timestamp: new Date().toISOString(),
        } as Response<T>;
      }),
    );
  }
}
