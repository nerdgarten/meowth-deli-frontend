import { type NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  return NextResponse.json({
    status: "OK",
    timestamp: Date.now(),
  });
}
