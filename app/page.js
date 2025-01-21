import { MusicController } from "@/components/music-controller";
import { Header } from "@/components/header";

export default function Home() {
	return (
		<div className='min-h-screen bg-background'>
			<Header />
			<main className='container mx-auto p-4'>
				<MusicController />
			</main>
		</div>
	);
}
