import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client = postgres(process.env.POSTGRES_URL!);

export const db = drizzle<typeof schema>(client);

declare global {
  const db: PostgresJsDatabase<typeof schema>;
}
