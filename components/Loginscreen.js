import { LoginButton } from "./login-button";

export function LoginScreen() {
	return (
		<div className='min-h-screen flex items-center justify-center gap-6 p-6'>
			<div className='text-center'>
				<h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mb-5'>
					Welcome to Ziji Bot
				</h1>
				<p className='mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mb-5'>
					Enhance your Discord server with moderation, fun commands, and powerful integrations.
				</p>
				<div className='flex justify-center mb-5'>
					<LoginButton />
				</div>
			</div>
		</div>
	);
}
