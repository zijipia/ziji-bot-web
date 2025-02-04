/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	async rewrites() {
		return [
			{
				source: "/api/ws",
				destination: `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/socket.io`,
			},
		];
	},
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{ key: "Access-Control-Allow-Origin", value: "*" },
					{ key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
					{ key: "Access-Control-Allow-Headers", value: "Content-Type" },
				],
			},
		];
	},
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				net: false,
				tls: false,
			};
		}
		return config;
	},
};

export default nextConfig;
