import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  const now = new Date();
  return NextResponse.json({
    serverTime: now.toISOString(),
    unixMs: now.getTime(),
  });
}
