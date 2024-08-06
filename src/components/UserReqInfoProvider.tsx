import { headers } from "next/headers";
import { UserId } from "./UserId";
import { getIPCountry } from "@/lib/utils";

export type UserReqInfo = {
  userAgent: string;
  ip: string;
  country: string;
};

export const UserIpAndOtherInfo = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const header = headers();

  const userAgent = header.get("user-agent") || "";
  const ip =
    header.get("x-real-ip") ||
    header.get("x-forwarded-for") ||
    header.get("remote-addr") ||
    header.get("cf-connecting-ip") ||
    "";
  const country = await getIPCountry(ip);
  const reqInfo = { userAgent, ip, country };
  return <UserId reqInfo={reqInfo}>{children}</UserId>;
};
