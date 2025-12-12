import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "node:fs";
import { PrismaClient } from "../generated/prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly pool: Pool;

    constructor() {
        const url = process.env.DATABASE_URL;
        if (!url) throw new Error("DATABASE_URL is missing");

        const caPath = process.env.PG_SSL_CA_PATH;

        const ssl = caPath
            ? {
                ca: fs.readFileSync(caPath, "utf8"),
                rejectUnauthorized: true,
                servername: new URL(url).hostname,
            }
            : undefined;

        const pool = new Pool({
            connectionString: url,
            ssl,
        });

        super({ adapter: new PrismaPg(pool) });
        this.pool = pool;
    }

    async onModuleInit(): Promise<void> {
        await this.$connect();
    }

    async onModuleDestroy(): Promise<void> {
        await this.$disconnect();
        await this.pool.end();
    }
}
