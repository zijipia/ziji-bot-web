import { MusicController } from "@/components/music-controller";
import { Header } from "@/components/header";

export default function Home() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] dark:from-[hsl(var(--dark-gradient-start))] dark:to-[hsl(var(--dark-gradient-end))]'>
			<Header />
			<main className='container mx-auto p-4'>
				<MusicController />
			</main>
		</div>
	);
}
