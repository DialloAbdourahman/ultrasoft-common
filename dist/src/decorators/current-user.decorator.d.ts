import { ILoggedInUserTokenData } from '../interfaces/loggedin-user-token-data';
export declare const CurrentUser: (...dataOrPipes: (keyof ILoggedInUserTokenData | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
