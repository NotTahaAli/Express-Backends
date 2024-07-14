import dbConfig from "../configs/db.config";

import { Pool, PoolClient } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
const pool = new Pool({
    connectionString: dbConfig.postgresURL
});

// the pool will emit an error on behalf of any idle clients it contains if a backend error or network partition happens
pool.on('error', (err: Error, _client: PoolClient) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
});

const db = drizzle(pool);

export async function migrateDB() {
    await migrate(db, { migrationsFolder: "drizzle" })
};

export default db