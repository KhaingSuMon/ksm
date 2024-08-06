import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export const POST = (req: NextRequest) => {
  // get all header info and console.log
  const { get } = headers();
  const ua = get("user-agent");
  const ip =
    get("x-real-ip") ||
    get("x-forwarded-for") ||
    get("remote-addr") ||
    get("cf-connecting-ip");
  console.log(ua, ip);

  return NextResponse.json({ message: "Liked" });
};
