"use server";
import { count, eq } from "drizzle-orm";
import { dbClient } from "../db";
import { deviceFingerprintTable, InsertDeviceFingerprint } from "../schema";

export const checkDeviceExist = async (digestId: string) => {
  const res = await dbClient
    .select({
      digestId: deviceFingerprintTable.digestId,
    })
    .from(deviceFingerprintTable)
    .where(eq(deviceFingerprintTable.digestId, digestId));
  return res;
};

export const createDeviceFingerprint = async (
  deviceInfo: InsertDeviceFingerprint
) => {
  try {
    const res = await checkDeviceExist(deviceInfo.digestId);

    if (res && res.length > 0) {
      const digestId = res[0].digestId;
      return digestId;
    } else {
      const res = await dbClient
        .insert(deviceFingerprintTable)
        .values(deviceInfo)
        .onConflictDoNothing()
        .returning({
          digestId: deviceFingerprintTable.digestId,
        });

      if (res && res.length > 0) {
        return res[0].digestId;
      }
    }
  } catch (error) {
    console.log(error);
  }
};
