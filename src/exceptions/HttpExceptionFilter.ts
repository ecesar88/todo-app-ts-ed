import { PlatformContext, ResponseErrorObject } from "@tsed/common";
import { Catch, ExceptionFilterMethods } from "@tsed/platform-exceptions";
import { Exception } from "@tsed/exceptions";
import { Prisma } from "@prisma/client";
import { HttpStatus } from "src/lib/enums/http-status.enum";

// @Catch('*')
@Catch(Error)
@Catch(Exception)
// @Catch(Prisma.PrismaClientKnownRequestError)
// Get only prisma exceptions, separate it from others
export class HttpExceptionFilter implements ExceptionFilterMethods {
  mapError(error: any) {
    return {
      name: error.origin?.name || error.name,
      message: error.message,
      status: error.status || 500,
      errors: this.getErrors(error)
    };
  }

  protected getErrors(error: any) {
    return [error, error.origin].filter(Boolean).reduce((errs, { errors }: ResponseErrorObject) => {
      return [...errs, ...(errors || [])];
    }, []);
  }

  protected getHeaders(error: any) {
    return [error, error.origin].filter(Boolean).reduce((obj, { headers }: ResponseErrorObject) => {
      return {
        ...obj,
        ...(headers || {})
      };
    }, {});
  }

  catch(exception: Exception, ctx: PlatformContext) {
    const { response, logger } = ctx;

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch ((exception as Prisma.PrismaClientKnownRequestError).code) {
        case "P2025": {
          console.log('\n\n\n\n\n\n\n AAAAA \n\n\n\n\n\n\n\n')
          return response.status(HttpStatus.NOT_FOUND).body({
            message: `Record to delete does not exist`
          });
        }

        case "P2002": {
          const constraintFields = exception.meta?.target as string[];

          return response.status(HttpStatus.CONFLICT).body({
            message: `Failed to create resource due to unique violation error on one or more fields`,
            fields: constraintFields.map((field) => field)
          });
        }

        default: {
          return response.status(HttpStatus.INTERNAL_SERVER_ERROR).body({
            message: exception.message
          });
        }
      }
    } else {
      // const error = this.mapError(exception);
      // const headers = this.getHeaders(exception);

      // logger.error({
      //   error
      // });

      // response.setHeaders(headers).status(error.status).body(error);
    }
  }
}
