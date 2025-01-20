import { NextResponse } from "next/server";

export async function GET(request) {
  const user = request.cookies.get("discord_user")?.value;

  if (user) {
    return NextResponse.json(JSON.parse(user));
  }

  return NextResponse.json(null);
}
