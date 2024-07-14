import { and, eq } from "drizzle-orm";
import db from "../db.service";
import { datastore } from "../schema/datastore";

export async function getData(userId: number, key: string, defaultValue: any = null) {
    const data = (await db.select({ value: datastore.value }).from(datastore).
        where(and(eq(datastore.id, userId), eq(datastore.key, key))).execute()).at(0);
    if (!data) return defaultValue;
    return (data.value as [unknown])[0];
}

export async function setData(userId: number, key: string, value: any) {
    return db.insert(datastore).values({ id: userId, key, value: [value] }).onConflictDoUpdate({ target: [datastore.id, datastore.key], set: { value: [value] }, where: and(eq(datastore.id, userId), eq(datastore.key, key)) }).execute();
}