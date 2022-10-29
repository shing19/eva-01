declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_TOKEN: string;
            GUILD_ID: string;
            CLIENT_ID: string;
            environment: "dev" | "prod" | "debug";
        }
    }
}

export {};