export declare const env: {
    readonly nodeEnv: string;
    readonly port: number;
    readonly frontendUrl: string;
    readonly databaseUrl: string;
    readonly jwt: {
        readonly accessSecret: string;
        readonly refreshSecret: string;
        readonly accessTtl: string;
        readonly refreshTtl: string;
    };
};
export declare const isProduction: boolean;
