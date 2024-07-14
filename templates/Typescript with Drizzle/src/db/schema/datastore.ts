import { bigint, jsonb, pgTable, text, unique } from "drizzle-orm/pg-core";

export const datastore = pgTable("datastore", {
    id: bigint('user_id', { mode: "number" }).primaryKey().notNull(),
    key: text('key').notNull(),
    value: jsonb('data').notNull()
}, (t) => ({
    uniq: unique("uniqKeyValuePair").on(t.id, t.key),
}));