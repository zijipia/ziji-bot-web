import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		const response = await fetch(`https://discord.com/api/users/@me/guilds`, {
			headers: {
				Authorization: `${session.token_type} ${session.accessToken}`,
			},
		});

		console.log(response);

		if (!response.ok) {
			throw new Error("Failed to fetch guilds");
		}

		const guilds = await response.json();

		guilds.forEach(async (guild) => {
			const channelsResponse = await fetch(`https://discord.com/api/guilds/${guild.id}/channels`, {
				headers: {
					Authorization: `${session.token_type} ${session.accessToken}`,
				},
			});

			if (!channelsResponse.ok) {
				return;
			}

			const channels = await channelsResponse.json();
			const voiceChannels = channels.filter((channel) => channel.type === 2); // 2 is the type for voice channels

			return new Response(JSON.stringify(voiceChannels), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		});
	} catch (error) {
		console.error("Error fetching voice channels:", error);
		return new Response(JSON.stringify({ error: "Failed to fetch voice channels" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
