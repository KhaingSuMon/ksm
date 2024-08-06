"use server";
import { eq, sql } from "drizzle-orm";
import { dbClient } from "../db";
import { allLikesCountTable } from "../schema";

export const getCount = async () => {
  const res = await dbClient
    .select({
      count: allLikesCountTable.count,
    })
    .from(allLikesCountTable);
  return res && res.length > 0 ? res[0].count : 0;
};

export const incrementCount = async (count: number) => {
  await dbClient
    .update(allLikesCountTable)
    .set({ count: sql`${allLikesCountTable.count} + ${count}` });
};

export const initCount = async () => {
  const res = await dbClient
    .select({
      count: allLikesCountTable.count,
    })
    .from(allLikesCountTable);
  if (res && res.length > 0) return;
  await dbClient.insert(allLikesCountTable).values({ count: 0 });
};
