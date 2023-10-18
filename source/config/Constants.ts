import * as dotenv from "dotenv";
dotenv.config();

export abstract class AppConfig {
    static readonly APP_NAME: string = process.env.APP_NAME ?? "";
    static readonly API_VERSION: string = "/api/v1";
    static readonly PORT: any = process.env.PORT ?? 3000;
    static readonly DB_CONNECTION: string = process.env.DB_CONNECTION ?? "";
}
