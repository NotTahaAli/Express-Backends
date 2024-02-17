import * as dbConfig from "../configs/db.config";

import mysql, { ProcedureCallPacket, QueryOptions, ResultSetHeader, RowDataPacket } from "mysql2";

export type Count = RowDataPacket&{count:number};

export const dbPool = mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    connectionLimit: 10
});

export const dbQuery = <Type extends RowDataPacket[] | ProcedureCallPacket | ResultSetHeader[] | RowDataPacket[][]>(query: string | QueryOptions, values?: any[]) => {
    return new Promise<Type>((resolve, reject) => {
        if (typeof query == "string") {
            query = {
                sql: query
            }
        }
        if (values) {
            if (query.values) query.values = query.values.concat(values);
            else query.values = values;
        }
        dbPool.query<Type>(query, (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};