"use server";
import { count, eq } from "drizzle-orm";
import { dbClient } from "../db";
import { realLikeDeviceTable, InsertRealLikeDevice } from "../schema";

export const insertRealLikeDevice = async (data: InsertRealLikeDevice) => {
  const res = await dbClient
    .insert(realLikeDeviceTable)
    .values(data)
    .onConflictDoNothing()
    .returning();
  return res;
};

export const checkRealLikeDeviceExist = async (digestId: string) => {
  const res = await dbClient
    .select()
    .from(realLikeDeviceTable)
    .where(eq(realLikeDeviceTable.digestId, digestId));
  console.log(res, res && res.length > 0);

  return res && res.length > 0;
};
