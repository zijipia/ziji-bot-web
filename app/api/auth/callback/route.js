import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    try {
      const tokenResponse = await fetch(
        "https://discord.com/api/oauth2/token",
        {
          method: "POST",
          body: new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            code,
            grant_type: "authorization_code",
            redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
            scope: "identify",
          }),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const tokenData = await tokenResponse.json();

      if (tokenData.access_token) {
        const userResponse = await fetch("https://discord.com/api/users/@me", {
          headers: {
            authorization: `${tokenData.token_type} ${tokenData.access_token}`,
          },
        });

        const userData = await userResponse.json();

        // Store user data in session or cookie
        // For simplicity, we'll use a cookie here
        const response = NextResponse.redirect(new URL("/", request.url));
        response.cookies.set("discord_user", JSON.stringify(userData), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return response;
      }
    } catch (error) {
      console.error("Error during Discord authentication:", error);
    }
  }

  return NextResponse.redirect(new URL("/", request.url));
}
