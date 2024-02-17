import { ResultSetHeader, RowDataPacket } from "mysql2";
import { dbQuery } from "./db.service";

export type itemData = {
    id?: bigint;
    name?: string;
    type?: string;
}

export type item = RowDataPacket & itemData;

export const createTable = async () => {
    await dbQuery(`
        CREATE TABLE IF NOT EXISTS items (
            id BIGINT UNSIGNED NOT NULL,
            name VARCHAR(255) NOT NULL,
            type VARCHAR(255) NOT NULL,
            PRIMARY KEY (id),
            UNIQUE (name, type, shiny)
        );
    `);
};

export const getAllItems = async () => {
    const result: item[] = await dbQuery(`
        SELECT * FROM items;
    `);
    return result;
}

export const getItemFromId = async (id: bigint) => {
    const result: item[] = await dbQuery(`
        SELECT * FROM items WHERE id = ?;
    `, [id]);
    if (result.length == 0) return null;
    return result[0];
}

export const getItemsFromDetails = async (name: string, type?: string) => {
    const result: item[] = await dbQuery(`
        SELECT * FROM items WHERE name = ? ${type != undefined ? `AND type = ? ` : ``}};
    `, [name, type]);
    return result;
}

export const getItemFromDetails = async (name: string, type: string) => {
    const result = await getItemsFromDetails(name, type);
    if (result.length == 0) return null;
    return result[0];
}

// Returns the id of the item
export const insertItem = async (product_id: bigint, name: string, type: string,) => {
    const result = await dbQuery<ResultSetHeader>(`
        INSERT IGNORE INTO items (id, name, type) VALUES (?, ?, ?, ?);
    `, [product_id, name, type]);
    return (result.affectedRows > 0) ? result.insertId : (await getItemFromDetails(name, type))?.id;
}