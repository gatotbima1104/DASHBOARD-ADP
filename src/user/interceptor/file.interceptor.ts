import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import path from 'path';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import fs from 'fs'

// ... (import statements and other code)

@Injectable()
export class FileInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const file = request.file;

    return next.handle().pipe(
      map((response) => {
        // Check the response structure based on your actual API response
        if (file && response && response.success) {
          const tempFilePath = file.path;
          const finalFilePath = path.join('./uploads', file.filename);
          fs.renameSync(tempFilePath, finalFilePath);
        }
        return response;
      })
    );
  }
}
