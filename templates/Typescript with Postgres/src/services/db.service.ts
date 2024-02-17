import dbConfig from "../configs/db.config";

import { Pool, PoolClient } from "pg";
const pool = new Pool({
    connectionString: dbConfig.postgresURL + "?sslmode=require"
});

// the pool will emit an error on behalf of any idle clients it contains if a backend error or network partition happens
pool.on('error', (err: Error, _client: PoolClient) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
});

export default pool