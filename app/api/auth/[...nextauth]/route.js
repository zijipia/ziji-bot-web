import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions = {
	providers: [
		DiscordProvider({
			clientId: process.env.DISCORD_CLIENT_ID,
			clientSecret: process.env.DISCORD_CLIENT_SECRET,
			authorization: { params: { scope: "identify email guilds" } },
		}),
	],
	callbacks: {
		async jwt({ token, profile, account }) {
			if (account) {
				token.accessToken = account.access_token;
				token.token_type = account.token_type;
				token.profile = profile;
			}
			return token;
		},
		async session({ session, token }) {
			session.accessToken = token.accessToken;
			session.token_type = token.token_type;
			session.user = token.profile;
			return session;
		},
	},
	// debug: process.env.NODE_ENV === "development",
	secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
