import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

export const sql = neon(process.env.DATABASE_URL!);
export const dbClient = drizzle(sql);
